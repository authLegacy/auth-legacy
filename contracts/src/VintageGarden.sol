// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ISP} from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import {Attestation} from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";
import {DataLocation} from "@ethsign/sign-protocol-evm/src/models/DataLocation.sol";

error VintageGarden__PriceMustBeAboveZero();
error VintageGarden__NotApprovedForMarketplace();
error VintageGarden__AlreadyOpenForSale(address nftAddress, uint256 tokenId);

error VintageGarden__NotOwner();
error VintageGarden__NotOpenForSale(address nftAddress, uint256 tokenId);
error VintageGarden__ItemNotOnHold(address nftAddress, uint256 tokenId);
error VintageGarden__NotBuyer(address nftAddress, uint256 tokenId);
error VintageGarden__NoPendingProceeds(address seller);
error VintageGarden__PriceNotMet(
    address nftAddress,
    uint256 tokenId,
    uint256 price
);

error VintageGarden__TransferFailed(address seller);

contract VintageGarden is ReentrancyGuard {
    // Type declaration
    struct Listing {
        uint256 price;
        uint256 numOfAttestations;
        uint256 numOfOwners;
        bool openForSale;
        bool onHold;
        address seller;
        address buyer;
    }
    ISP public i_spInstance;
    uint64 public i_schemaId;
    address private constant SP_BASE_SEPOLIA =
        0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD;
    bytes8 private constant SCHEMA_ID_BYTES8 = bytes8(uint64(0x4a2));

    mapping(address => mapping(uint256 => uint256))
        public tokenToNumOfAttestations;

    constructor() {
        i_spInstance = ISP(SP_BASE_SEPOLIA);
        i_schemaId = uint64(SCHEMA_ID_BYTES8);
    }

    //     // Events
    event ItemPutOnSale(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemOnHold(
        address indexed nftAddress,
        uint256 indexed tokenId,
        address seller,
        address buyer
    );
    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event SaleCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    event AuthenticityAttested(
        address indexed attester,
        address nftAddress,
        uint256 tokenId,
        uint64 attestationId
    );

    // NFT contract address -> NFT tokenId -> Listing
    mapping(address => mapping(uint256 => Listing)) private s_listings;

    // seller/ buyer -> pending proceeds
    mapping(address => uint256) private s_pendingProceeds;

    mapping(address => Listing[]) s_attesters;

    modifier notOpenForSale(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.openForSale) {
            revert VintageGarden__AlreadyOpenForSale(nftAddress, tokenId);
        }
        _;
    }

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert VintageGarden__NotOwner();
        }
        _;
    }

    modifier isOpenForSale(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (!listing.openForSale) {
            revert VintageGarden__NotOpenForSale(nftAddress, tokenId);
        }
        _;
    }

    modifier isItemOnHold(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (!listing.onHold) {
            revert VintageGarden__ItemNotOnHold(nftAddress, tokenId);
        }
        _;
    }

    function confirmAuthenticity(
        address nftAddress,
        uint256 tokenId
    ) external returns (uint64) {
        Attestation memory a = Attestation({
            schemaId: i_schemaId,
            linkedAttestationId: 0,
            attestTimestamp: 0,
            revokeTimestamp: 0,
            attester: address(this),
            validUntil: 0,
            dataLocation: DataLocation.ONCHAIN,
            revoked: false,
            recipients: new bytes[](0),
            data: abi.encode(nftAddress, tokenId)
        });
        uint64 attestationId = i_spInstance.attest(a, "", "", "");
        s_listings[nftAddress][tokenId].numOfAttestations += 1;
        s_attesters[msg.sender].push(s_listings[nftAddress][tokenId]);
        emit AuthenticityAttested(
            msg.sender,
            nftAddress,
            tokenId,
            attestationId
        );
        return attestationId;
    }

    function sellItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        notOpenForSale(nftAddress, tokenId, msg.sender)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert VintageGarden__PriceMustBeAboveZero();
        }

        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert VintageGarden__NotApprovedForMarketplace();
        }
        // first sell and subsequent sells
        if (s_listings[nftAddress][tokenId].numOfOwners == 0) {
            s_listings[nftAddress][tokenId] = Listing(
                price,
                0,
                1,
                true,
                false,
                msg.sender,
                address(0)
            );
        }
        Listing memory listing = s_listings[nftAddress][tokenId];
        listing.price = price;
        listing.openForSale = true;
        listing.buyer = address(0);
        emit ItemPutOnSale(msg.sender, nftAddress, tokenId, price);
    }

    function buyItem(
        address nftAddress,
        uint256 tokenId
    ) external payable nonReentrant isOpenForSale(nftAddress, tokenId) {
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        if (msg.value < listedItem.price) {
            revert VintageGarden__PriceNotMet(
                nftAddress,
                tokenId,
                listedItem.price
            );
        }
        listedItem.buyer = msg.sender;
        listedItem.onHold = true;
        s_pendingProceeds[msg.sender] = msg.value;

        emit ItemOnHold(
            nftAddress,
            tokenId,
            listedItem.seller,
            listedItem.buyer
        );
    }

    function confirmDelivery(
        address nftAddress,
        uint256 tokenId
    ) external nonReentrant isItemOnHold(nftAddress, tokenId) {
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        if (msg.sender != listedItem.buyer) {
            revert VintageGarden__NotBuyer(nftAddress, tokenId);
        }
        s_pendingProceeds[listedItem.seller] = s_pendingProceeds[
            listedItem.buyer
        ];
        s_pendingProceeds[listedItem.buyer] = 0;
        IERC721(nftAddress).safeTransferFrom(
            listedItem.seller,
            msg.sender,
            tokenId
        );
        listedItem.numOfOwners += 1;
        listedItem.openForSale = false;
        listedItem.onHold = false;
        listedItem.seller = address(0);
        listedItem.buyer = address(0);
        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    }

    function cancelSale(
        address nftAddress,
        uint256 tokenId
    )
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isOpenForSale(nftAddress, tokenId)
    {
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        listedItem.openForSale = false;
        listedItem.seller = address(0);
        emit SaleCanceled(msg.sender, nftAddress, tokenId);
    }

    // function updateListing(
    //     address nftAddress,
    //     uint256 tokenId,
    //     uint256 newPrice
    // )
    //     external
    //     isListed(nftAddress, tokenId)
    //     isOwner(nftAddress, tokenId, msg.sender)
    // {
    //     s_listings[nftAddress][tokenId].price = newPrice;
    //     emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
    // }

    function withdrawPendingProceeds() external {
        uint256 proceeds = s_pendingProceeds[msg.sender];
        if (proceeds <= 0) {
            revert VintageGarden__NoPendingProceeds(msg.sender);
        }
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        if (!success) {
            revert VintageGarden__TransferFailed(msg.sender);
        }
    }

    function getListing(
        address nftAddress,
        uint256 tokenId
    ) external view returns (Listing memory) {
        return s_listings[nftAddress][tokenId];
    }

    function getPendingProceeds(
        address seller
    ) external view returns (uint256) {
        return s_pendingProceeds[seller];
    }
}

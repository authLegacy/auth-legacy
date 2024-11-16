// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ISP} from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import {Attestation} from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";
import {DataLocation} from "@ethsign/sign-protocol-evm/src/models/DataLocation.sol";

error AuthLegacyGarden__PriceMustBeAboveZero();
error AuthLegacyGarden__NotApprovedForMarketplace();
error AuthLegacyGarden__AlreadyOpenForSale(address nftAddress, uint256 tokenId);

error AuthLegacyGarden__NotOwner();
error AuthLegacyGarden__NotOpenForSale(address nftAddress, uint256 tokenId);
error AuthLegacyGarden__ItemNotOnHold(address nftAddress, uint256 tokenId);
error AuthLegacyGarden__ItemOnHold(address nftAddress, uint256 tokenId);
error AuthLegacyGarden__NotBuyer(address nftAddress, uint256 tokenId);
error AuthLegacyGarden__NoPendingProceeds(address seller);
error AuthLegacyGarden__PriceNotMet(
    address nftAddress,
    uint256 tokenId,
    uint256 price
);

error AuthLegacyGarden__TransferFailed(address seller);

contract AuthLegacyGarden is ReentrancyGuard {
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

    // Events
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

    // buyer -> pending proceeds
    mapping(address => mapping(uint256 => uint256))
        private s_pendingBuyerProceeds;

    // seller -> pending proceeds
    mapping(address => mapping(uint256 => uint256))
        private s_pendingSellerProceeds;

    mapping(address => Listing[]) s_attesters;

    modifier notOpenForSale(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.openForSale) {
            revert AuthLegacyGarden__AlreadyOpenForSale(nftAddress, tokenId);
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
            revert AuthLegacyGarden__NotOwner();
        }
        _;
    }

    modifier isOpenForSale(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (!listing.openForSale) {
            revert AuthLegacyGarden__NotOpenForSale(nftAddress, tokenId);
        }
        _;
    }

    modifier isItemOnHold(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (!listing.onHold) {
            revert AuthLegacyGarden__ItemNotOnHold(nftAddress, tokenId);
        }
        _;
    }

    modifier notOnHold(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.onHold) {
            revert AuthLegacyGarden__ItemOnHold(nftAddress, tokenId);
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
        notOpenForSale(nftAddress, tokenId)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert AuthLegacyGarden__PriceMustBeAboveZero();
        }

        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert AuthLegacyGarden__NotApprovedForMarketplace();
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
        listing.seller = msg.sender;
        listing.buyer = address(0);
        emit ItemPutOnSale(msg.sender, nftAddress, tokenId, price);
    }

    function buyItem(
        address nftAddress,
        uint256 tokenId
    ) external payable nonReentrant isOpenForSale(nftAddress, tokenId) {
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        if (msg.value < listedItem.price) {
            revert AuthLegacyGarden__PriceNotMet(
                nftAddress,
                tokenId,
                listedItem.price
            );
        }
        listedItem.buyer = msg.sender;
        listedItem.onHold = true;
        s_pendingBuyerProceeds[nftAddress][tokenId] = msg.value;

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
            revert AuthLegacyGarden__NotBuyer(nftAddress, tokenId);
        }
        s_pendingSellerProceeds[nftAddress][tokenId] = s_pendingBuyerProceeds[
            nftAddress
        ][tokenId];
        s_pendingBuyerProceeds[nftAddress][tokenId] = 0;
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

    function withdrawPendingSellerProceeds(
        address nftAddress,
        uint256 tokenId
    ) external notOnHold(nftAddress, tokenId) {
        uint256 proceeds = s_pendingSellerProceeds[nftAddress][tokenId];
        if (proceeds <= 0) {
            revert AuthLegacyGarden__NoPendingProceeds(msg.sender);
        }
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        if (!success) {
            revert AuthLegacyGarden__TransferFailed(msg.sender);
        }
    }

    function withdrawBuyerProceeds(
        address nftAddress,
        uint256 tokenId
    ) external notOnHold(nftAddress, tokenId) {
        uint256 proceeds = s_pendingBuyerProceeds[nftAddress][tokenId];
        if (proceeds <= 0) {
            revert AuthLegacyGarden__NoPendingProceeds(msg.sender);
        }
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        if (!success) {
            revert AuthLegacyGarden__TransferFailed(msg.sender);
        }
    }

    function getListing(
        address nftAddress,
        uint256 tokenId
    ) external view returns (Listing memory) {
        return s_listings[nftAddress][tokenId];
    }
}

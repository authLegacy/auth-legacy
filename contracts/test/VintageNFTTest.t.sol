//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Test} from "forge-std/Test.sol";
import {VintageNFT} from "../src/VintageNFT.sol";
import {DeployVintageNFT} from "../script/DeployVintageNFT.s.sol";

contract VintageNFTTest is Test {
    DeployVintageNFT public deployer;
    VintageNFT public vintageNft;

    function setUp() public {
        deployer = new DeployVintageNFT();
        vintageNft = deployer.run();
    }

    function testNameIsCorrect() public view {
        string memory expectedName = "Vintage";
        string memory actualName = vintageNft.name();
        assert(
            keccak256(abi.encodePacked(expectedName)) ==
                keccak256(abi.encodePacked(actualName))
        );
    }
}

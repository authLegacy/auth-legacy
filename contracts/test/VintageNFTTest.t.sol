//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Test} from "forge-std/Test.sol";
import {AuthLegacyNFT} from "../src/AuthLegacyNFT.sol";
import {DeployAuthLegacyNFT} from "../script/DeployAuthLegacyNFT.s.sol";

contract AuthLegacyNFTTest is Test {
    DeployAuthLegacyNFT public deployer;
    AuthLegacyNFT public authLegacyNft;

    function setUp() public {
        deployer = new DeployAuthLegacyNFT();
        authLegacyNft = deployer.run();
    }

    function testNameIsCorrect() public view {
        string memory expectedName = "AuthLegacy";
        string memory actualName = authLegacyNft.name();
        assert(
            keccak256(abi.encodePacked(expectedName)) ==
                keccak256(abi.encodePacked(actualName))
        );
    }
}

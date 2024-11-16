// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {AuthLegacyNFT} from "../src/AuthLegacyNFT.sol";
import {console} from "forge-std/console.sol";

contract DeployAuthLegacyNFT is Script {
    function run() external returns (AuthLegacyNFT) {
        vm.startBroadcast();
        AuthLegacyNFT authLegacyNft = new AuthLegacyNFT();
        vm.stopBroadcast();
        return authLegacyNft;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {VintageNFT} from "../src/VintageNFT.sol";
import {console} from "forge-std/console.sol";

contract DeployVintageNFT is Script {
    function run() external returns (VintageNFT) {
        vm.startBroadcast();
        VintageNFT vintageNft = new VintageNFT();
        vm.stopBroadcast();
        return vintageNft;
    }
}

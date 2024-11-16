// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {VintageGarden} from "../src/VintageGarden.sol";
import {console} from "forge-std/console.sol";

contract DeployVintageGarden is Script {
    function run() external returns (VintageGarden) {
        vm.startBroadcast();
        VintageGarden vintageGarden = new VintageGarden();
        vm.stopBroadcast();
        return vintageGarden;
    }
}

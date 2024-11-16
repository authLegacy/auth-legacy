// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {AuthLegacyGarden} from "../src/AuthLegacyGarden.sol";
import {console} from "forge-std/console.sol";

contract DeployAuthLegacyGarden is Script {
    function run() external returns (AuthLegacyGarden) {
        vm.startBroadcast();
        AuthLegacyGarden authLegacyGarden = new AuthLegacyGarden();
        vm.stopBroadcast();
        return authLegacyGarden;
    }
}

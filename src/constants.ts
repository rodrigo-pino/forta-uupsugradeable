export const UPGRADED_EVENT_ABI =
  "event Upgraded(address indexed implementation)";
export const UPGRADE_TO_ABI =
  "function upgradeTo(address newImplementation) external virtual onlyProxy";
export const UPGRADE_TO_AND_CALL_ABI =
  "function upgradeToAndCall(address newImplementation, bytes memory data) external payable virtual onlyProxy";

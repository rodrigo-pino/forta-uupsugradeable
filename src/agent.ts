import BigNumber from "bignumber.js";
import {
  BlockEvent,
  Finding,
  HandleBlock,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
  LogDescription,
  ethers,
} from "forta-agent";

import {
  UPGRADED_EVENT_ABI,
  UPGRADE_TO_ABI,
  UPGRADE_TO_AND_CALL_ABI,
} from "./constants";

const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = [];

  // Check functions called in transaction to differentiate
  // between UUPSUpgradeable and Transparent Proxies
  // They have equal names but different modifiers!
  const functions = txEvent.filterFunction([
    UPGRADE_TO_ABI,
    UPGRADE_TO_AND_CALL_ABI,
  ]);
  console.log(functions);
  //if (functions.length === 0) return findings;

  // Get all upgraded events
  const logs: LogDescription[] = txEvent.filterLog(UPGRADED_EVENT_ABI);
  console.log(logs);

  // Use the ethercan provider to review the bytecode of all upgraded
  // contracts
  const etherscanProvider = new ethers.providers.EtherscanProvider(
    "homestead",
    process.env.ETHERSCAN_API_KEY
  );

  logs.forEach(async (upgradedLog) => {
    // retrieve the address of the upgraded event
    const contractAddress = upgradedLog.address;

    // get the bytecode of the contract at the retrieved address
    const byteCode = await etherscanProvider.getCode(contractAddress);

    // A contract has 0x bytecode when destroyed
    if (byteCode === "0x") {
      // throw an alert!
      findings.push(
        Finding.fromObject({
          name: "UUPSUpgradeable contract self-destroyed",
          description: `UUPSUpgradeable contract on ${contractAddress} self-destroyed`,
          alertId: "UUPSU-DESTROYED-1",
          severity: FindingSeverity.High,
          type: FindingType.Suspicious,
        })
      );
    }
  });

  return findings;
};

export default {
  handleTransaction,
};

import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
  LogDescription,
  ethers,
} from "forta-agent";

import { UPGRADED_EVENT_ABI } from "./constants";

const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = [];

  // Get all upgraded events
  const logs: LogDescription[] = txEvent.filterLog(UPGRADED_EVENT_ABI);

  // Use the ethercan provider to review the bytecode of all upgraded
  // contracts
  const etherscanProvider = new ethers.providers.EtherscanProvider(
    "homestead",
    process.env.ETHERSCAN_API_KEY
  );

  //logs.forEach((upgradedLog) => {
  for (const upgradedLog of logs) {
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
  }

  return findings;
};

export default {
  handleTransaction,
};

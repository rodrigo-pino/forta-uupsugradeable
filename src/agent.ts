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

import { UPGRADED_EVENT_ABI } from "./constants";

const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = [];
  const logs: LogDescription[] = txEvent.filterLog(UPGRADED_EVENT_ABI);

  if (logs.length === 0) return findings;

  const etherscanProvider = new ethers.providers.EtherscanProvider("homestead");

  logs.forEach(async (upgradedLog) => {
    const contractAddress = upgradedLog.address;
    const byteCode = await etherscanProvider.getCode(contractAddress);
    if (byteCode == "0x") {
      // report alert
      findings.push(
        Finding.fromObject({
          name: "Name",
          description: "description",
          alertId: "an alert",
          severity: FindingSeverity.High,
          type: FindingType.Degraded,
        })
      );
    }
  });

  return findings;
};

export default {
  handleTransaction,
};

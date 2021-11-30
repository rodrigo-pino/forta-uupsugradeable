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
} from "forta-agent";
import { UPGRADED_EVENT_ABI } from "./constants";

const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = [];

  const logs: LogDescription[] = txEvent.filterLog(UPGRADED_EVENT_ABI);

  logs.forEach((log) => {
    const contractAddress = log.args.implementation;
    console.log(contractAddress);
    console.log(typeof contractAddress);
  });

  return findings;
};

export default {
  handleTransaction,
};


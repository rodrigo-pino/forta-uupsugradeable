import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent,
} from "forta-agent";
import agent from "./agent";

describe("proxy agent", () => {
  let handleTransaction: HandleTransaction;

  const createTxEvent = (mockAddress: string) => {
    const txEvent = createTransactionEvent({
      transaction: {} as any,
      receipt: {} as any,
      block: {} as any,
    });
    txEvent.filterLog = () => [
      {
        eventFragment: {} as any,
        name: {} as any,
        signature: {} as any,
        topic: {} as any,
        args: {} as any,
        address: mockAddress,
      },
    ];
    return txEvent;
  };

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
  });

  describe("testing contract", () => {
    it("returns empty findings if upgraded contract is not destroyed", async () => {
      const address = "0x222222222291749DE47895C0c0A9B17e4fcA8268";
      const mockTransaction = createTxEvent(address);

      const findings = await handleTransaction(mockTransaction);

      expect(findings).toStrictEqual([]);
    });
    it("returns and alert because contract has been destroyed", async () => {
      const address = "0x310fAC62C976d8F6FDFA34332a56EA1a05493b5b";
      const mockTransaction = createTxEvent(address);

      const findings = await handleTransaction(mockTransaction);

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "UUPSUpgradeable contract self-destroyed",
          description: `UUPSUpgradeable contract on ${address} self-destroyed`,
          alertId: "UUPSU-DESTROYED-1",
          severity: FindingSeverity.High,
          type: FindingType.Suspicious,
        }),
      ]);
    });
  });
});

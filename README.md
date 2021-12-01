# UUPSUpgradeable Agent

## Description

This agent detects when the implementation contract of an UUPSUpgradeable contract gets self destroyed.

It also detects when a Transparent Proxy is deleted, since both implementation by OpenZeppelin fire the same event. An attempt was made for the agent to separate the proxy type by scanning the functions that leads to _event Upgraded_ to fire, but since this functions have  _virtual_ and a custom modifiers that  _filterFunctions_ cannot recognize this issue is yet to be resolved.

## Supported Chains

- Ethereum

## Alerts

Describe each of the type of alerts fired by this agent

- UUPSU-DESTROYED-1
  - Fired when an event _Upgraded_ is detected by a contract which has self destroyed.
  - Severity is always set to "high" 
  - Type is always set to "suspicious"

## Test Data

- No test data was found

# staking


## Install all the required dependencies

``` bash
yarn
```

## How to use 

```bash
node claim.js 0 
```

By setting up the `claim.js` to your daily routine / scheduler in the OS level, it helps you to claim the KSM payouts automatically.

Add `0` to the last argument if you are nominator.

Add `1` to the last argument if you are validator.

## Environment variables

`WS_ENDPOINT` -  Websocket endpoint used to communicate with the network (e.g. wss://kusama-rpc.polkadot.io/ or wss://cc3-5.kusama.network/)

`MNEMONIC` - Your nominator/validator account (It also supports addFromSeed, free feel to change it for your need)


## Ouput

```bash
node claim.js 1
Your address is DMTHrNcmA8QbqRS4rBq8LXn8ipyczFoNMb1X4cY2WD9tdBX
You have 1 unclaim payouts.
You last payout era is 632
Submitted with hash 0x3958a3badbd53ea30e7da47e531f9c2d870f81a41cabd9286eb00157b50236ff
```

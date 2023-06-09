This is [Hardhat](https://hardhat.org/) project including Solidity Smart concracts and Testing files.

## Getting Started

First, `npm install` and install packages.

```bash
npm install
# or
npm i
```

Second, create `.env` file and write some config vars according to `.env.example`

(To use chainlink VRF, you should click [this](https://vrf.chain.link/?_ga=2.194788333.1171661276.1686287966-978871820.1683006690&_gac=1.251218804.1686288855.CjwKCAjw-IWkBhBTEiwA2exyO8tvB4Ar1GpzdoUzdZUaLQA-8RlFIP9tXZX3TAit09bP0SaLrYu0XxoC7rYQAvD_BwE), create subscription and get subscription id) 

```bash
# 1. RPC URL (
SEPOLIA_RPC_URL=""
# or
MUMBAI_RPC_URL= ""

# 2. Your wallet account's private key
PRIVATE_KEY= ""

# 3. Chainlink VRF subscription id
SUBSCRIPTION_ID = 

```

Now you are ready to go!

If you prefer Remix, just copy the `contracts/Trypto_for_remix.sol` file and paste on [Remix](https://remix.ethereum.org/#lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.18+commit.87f61d96.js)

If you want to write, compile, deploy and test with Hardhat, keep eyes on me!

---

## How to Deploy Contracts

You should write `npx hardhat compile` for comipile first,
and `npx hardhat run --network mumbai scripts/deploy.ts` for deploying.
(for sepolia, `npx hardhat run --network sepolia scripts/deploy.ts`)

```bash
# compile 
npx hardhat compile

# deploy
npx hardhat run --network mumbai scripts/deploy.ts
# or
npx hardhat run --network sepolia scripts/deploy.ts


```
If it is successfully depolyed, you will get contract address(CA) on your console.

```bash

Contract Trypto Successfuuly Deployed with unlock timestamp 1685519621 deployed to 0xe1340bFAbB988C10bcD58051a5f96F4eA0028576

```

---

## How to test your smart contracts

Hardhat provides testing tools for smart contracts.

```bash

npx hardhat test

```

We already made some testing units for `Trypto1.sol`, except for chainlink products(VRF, Automation, Data Feed).

If you customize or make your own tests, modify or create `tests/Trypto1.sepc.ts'.

Hardhat provide local testnet so that your contracts are deployed to hardhat local-network and be tested.

---

## Learn More

To learn more about Chainlink products we use (VRF, DataFeed, Automation), take a look at the following resources :

- [Chainlink Docs](https://docs.chain.link/)

To learn and practice simple contract codes for studying chainlink products, take a look at the following references :

- [Build Defi apps with chainlink](https://velog.io/@youngju307/%EC%B2%B4%EC%9D%B8%EB%A7%81%ED%81%AC-Building-a-DeFi-App-Code-along)



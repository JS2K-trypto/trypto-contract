import { ethers } from "hardhat";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = ethers.utils.parseEther("0.001");
  // Select contract factory in your contracts/ 
  const Trypto = await ethers.getContractFactory("Trypto");
  const Vrf = await ethers.getContractFactory("Vrf");
  // Set Constructor args when you deploy your contract, in "Trypto", it is "interval"
  const lock_trypto = await Trypto.deploy(60);
  const susbscription_id = Number(process.env.SUBSCRIPTION_ID);
  const lock_vrf = await Vrf.deploy(susbscription_id)
  await lock_trypto.deployed();
  await lock_vrf.deployed();

  console.log(
    `Contract Trypto Successfuuly Deployed with unlock timestamp ${unlockTime} deployed to ${lock_trypto.address}`,
    `Contract Vrf Successfuuly Deployed with unlock timestamp ${unlockTime} deployed to ${lock_vrf.address}`,
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const LetterFactory = await hre.ethers.getContractFactory("LetterFactory");
  const letterFactory = await LetterFactory.deploy();

  await letterFactory.deployed();

  console.log("LetterFactory deployed to:", letterFactory.address);

  const tx = await letterFactory.createLetter("𝔥𝔢𝔩𝔩𝔬 𝔴𝔬𝔯𝔩𝔡", "𝔯𝔬𝔰𝔢𝔰 𝔞𝔯𝔢 𝔯𝔢𝔡 🌹", "𝖇𝖊𝖆𝖗");
  const { events } = await tx.wait();
  const { address } = events.find(Boolean);

  console.log("Created Letter at Address: " + address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

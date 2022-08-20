async function main() {
  //Fetch contract to deploy
  const Darktoken = await ethers.getContractFactory("Darktoken")

  //Deploy contract
  const darktoken = await Darktoken.deploy()
  await darktoken.deployed()
  console.log(`Darktoken was deployed to ${darktoken.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

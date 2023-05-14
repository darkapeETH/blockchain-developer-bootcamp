async function main() {
  console.log(`Preparing Deployment...`)
  //Fetch contract to deploy
  const Darktoken = await ethers.getContractFactory('Darktoken')
  const Exchange = await ethers.getContractFactory('Exchange')

  //Fetch accounts
  const accounts = await ethers.getSigners()

  console.log(`accounts fetched: '${accounts[0].address} ${accounts[1].address} `)

  //Deploy contracts
  const DARK = await Darktoken.deploy('Dark Token','DARK','1000000')
  await DARK.deployed()
  console.log(`DARK token was deployed to ${DARK.address}`)

  const mETH = await Darktoken.deploy('mETH','mETH','1000000')
  await mETH.deployed()
  console.log(`mETH token was deployed to ${mETH.address}`)

  const mDAI = await Darktoken.deploy('mETH DAI','mDAI','1000000')
  await mDAI.deployed()
  console.log(`mDAI token was deployed to ${mDAI.address}`)

  const exchange = await Exchange.deploy(accounts[1].address,10)
  await exchange.deployed()
  console.log(`Exchange was deployed to ${exchange.address}`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


//Step by step explanation
//1. The main() function is declared as an asynchronous function.
//2. The console logs the message "Preparing Deployment..."
//3. The Darktoken and Exchange contracts are fetched from ethers.getContractFactory().
//4. The Darktoken contract is deployed using the deploy() method. 
//5. The deployed() method is used to check if the deployment was successful and the address of the deployed contract is logged to the console. 
//6. An error handler is set up to catch any errors that may occur during execution of the main() function and log them to the console, setting the process exit code to 1 if an error occurs.
const config = require('../src/config.json')

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const wait = (seconds) => {
  const milliseconds = seconds * 1000
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function main() {
  //Fetch accounts
  const accounts = await ethers.getSigners()

  //Fetch Network
  const { chainId } = await ethers.provider.getNetwork()
  console.log("Using chainId:", chainId)

  //Fetch Contracts

  const DARK = await ethers.getContractAt('Darktoken', config[chainId].DARK.address)
  console.log(`DARK token Fetched: ${DARK.address}`)


  const mETH = await ethers.getContractAt('Darktoken', config[chainId].mETH.address)
  console.log(`mETH token Fetched: ${mETH.address}`)
  
  const mDAI = await ethers.getContractAt('Darktoken', config[chainId].mDAI.address)
  console.log(`mDAI token Fetched: ${mDAI.address}`)

  //Fetch Exchange
  const exchange = await ethers.getContractAt('Exchange', config[chainId].exchange.address)
  console.log(`Exchange Fetched: ${exchange.address}`)

  //Give tokens to account[1]
  const sender = accounts[0]
  const receiver = accounts [1]
  let amount = tokens(10000)
  let transaction, result
  transaction = await mETH.connect(sender).transfer(receiver.address, amount)
  console.log(`Transferred ${amount} mETH tokens from ${sender.address} to ${receiver.address}`)

  //Set up exchange Users
  const user1 = accounts[0]
  const user2 = accounts[1]
  amount = tokens(10000)

  //User 1 Approves 10000 DARK...
  transaction = await DARK.connect(user1).approve(exchange.address, amount)
  await transaction.wait()
  console.log(`Approved ${amount} DARK tokens from ${user1.address}`)

  //User 1 Deposits 10000 DARK
  transaction = await exchange.connect(user1).depositToken(DARK.address, amount)
  await transaction.wait()
  console.log (`Deposited ${amount} DARK tokens from ${user1.address}`)

  //User 2 Approves 10000 mETH...
  transaction = await mETH.connect(user2).approve(exchange.address, amount)
  await transaction.wait()
  console.log(`Approved ${amount} mETH tokens from ${user2.address}`)

  //User 2 Deposits 10000 mETH
  transaction = await exchange.connect(user2).depositToken(mETH.address, amount)
  await transaction.wait()
  console.log (`Deposited ${amount} mETH tokens from ${user2.address}`)

  //////////////////Seed a Cancelled order

  let orderId
  transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), DARK.address,tokens(5))
  result = await transaction.wait()
  console.log(`Made 1st order from ${user1.address}`)

  orderId = result.events[0].args.id
  transaction = await exchange.connect(user1).cancelOrder(orderId)
  result = await transaction.wait()
  console.log(`cancelled order from ${user1.address}`)

  //Wait 1 Second
  await wait(1)

  //////////////////Seed Filled Orders

  //User1 makes order
  transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), DARK.address, tokens(10))
  result = await transaction.wait()
  console.log(`Made 2nd order from ${user1.address}`)

  //User2 Fills Order
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user2).fillOrder(orderId)
  result = await transaction.wait()
  console.log(`Filled 2nd order from ${user1.address}`)

  //Wait 1 Second
  await wait(1)

  //User1 makes order
  transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(50), DARK.address, tokens(15))
  result = await transaction.wait()
  console.log(`Made 3rd order from ${user1.address}`)

  //User2 Fills Order
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user2).fillOrder(orderId)
  result = await transaction.wait()
  console.log(`Filled 3rd order from ${user1.address}`)

  //Wait 1 Second
  await wait(1)

  //User1 makes order
  transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(200), DARK.address, tokens(20))
  result = await transaction.wait()
  console.log(`Made 4th order from ${user1.address}`)

  //User2 Fills Order
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user2).fillOrder(orderId)
  result = await transaction.wait()
  console.log(`Filled 4th order from ${user1.address}`)

  //Wait 1 Second
  await wait(1)

  //////////////////Seed Open Orders

  // User 1 Makes 10 orders
  exchange.connect(user1).makeOrder(mETH.address, tokens(10), DARK.address, tokens(10))
    result = await transaction.wait()
    console.log(`Made 5th order from ${user1.address}`)
    await wait(1)
  exchange.connect(user1).makeOrder(mETH.address, tokens(20), DARK.address, tokens(10))
    result = await transaction.wait()
    console.log(`Made 6th order from ${user1.address}`)
    await wait(1)
  exchange.connect(user1).makeOrder(mETH.address, tokens(30), DARK.address, tokens(10))
    result = await transaction.wait()
    console.log(`Made 7th order from ${user1.address}`)
    await wait(1)

  for(let i = 4; i <=10; i++) {
    exchange.connect(user1).makeOrder(mETH.address, tokens(10 * i), DARK.address, tokens(10))
    result = await transaction.wait()
    console.log(`Made 7 more orders from ${user1.address}`)
    await wait(1)
  }

// User 2 Makes 10 orders
  for(let i = 1; i <=10; i++) {
    exchange.connect(user2).makeOrder(DARK.address, tokens(10), mETH.address, tokens(10 * i))
    result = await transaction.wait()
    console.log(`Made 10 more orders from ${user2.address}`)
    await wait(1)
  }
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

# Decentralized Exchange Project

The project focused on building a Real-World DeFi project and featured a step-by-step coding of a decentralized cryptocurrency exchange. 

Try running the following test:

```shell
npx hardhat test
```

You should be getting the following test results:
 Darktoken
    Deployment
      ✔ has correct name
      ✔ has correct symbol
      ✔ has 18 decimals
      ✔ has correct totalSupply
      ✔ assigns totalSupply to deployer
    Sending Token
      Success
        ✔ transfers token balances
        ✔ emits a transfer event
      Failure
        ✔ rejects insufficient balances
        ✔ rejects invalid recipent
    Approving Tokens
      Success
        ✔ allocates an allowance for delegated token spending
        ✔ emits an approval event
      Failure
        ✔ rejects invalid spenders
    Delegated Token Transfers
      Success
        ✔ transfers token balances to receiver
        ✔ resets the allowance
        ✔ emits a transfer event
      Failure
        ✔ prevents an invalid transfer

  Exchange
    Deployment
      ✔ tracks the fee account
      ✔ tracks the fee percent
    Depositing Tokens
      Success
        ✔ tracks the token deposit
        ✔ emits a deposit event
      Failure
        ✔ fails when no tokens are approved
    Withdrawing Tokens
      Success
        ✔ withdraws token funds
        ✔ emits a withdraw event
      Failure
        ✔ fails for insufficient balances
    Checking Balances
      ✔ returns user balance
    Making Orders
      Success
        ✔ tracks the newly created order
        ✔ emits an order event
      Failure
        ✔ rejects orders that have no balance
    Order actions
      Cancelling orders
        Success
          ✔ updates canceled orders
          ✔ emits a cancel event
        Failure
          ✔ rejects invalid order ids
          ✔ rejects unauthorized cancelations
      Filling orders
        success
          ✔ Executes the trade and charges fees
          ✔ updates filled orders
          ✔ emits a trade event
        failure
          ✔ rejects invalid order ids
          ✔ rejects already filled orders
          ✔ rejects cancelled orders


  38 passing (4s)
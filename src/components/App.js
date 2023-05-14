import { useEffect } from 'react';
import { ethers } from 'ethers';
import TOKEN_ABI from '../ABIs/Token.json'
import config from '../config.json'
import '../App.css';

function App() {

  const loadBloackchainData = async () => {
    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
    console.log(accounts[0])

    //connect ethers to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const { chainId } = await provider.getNetwork()
    console.log(chainId)
    //token smart contract

    const DARK = new ethers.Contract(config[chainId].DARK.address, TOKEN_ABI, provider)
    console.log(DARK.address)
    const symbol = await DARK.symbol()
    console.log(symbol)

  }

  useEffect(() => {
    loadBloackchainData()

  })

  return (
    <div>

      {/* Navbar */}

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          {/* Markets */}

          {/* Balance */}

          {/* Order */}

        </section>
        <section className='exchange__section--right grid'>

          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}

        </section>
      </main>

      {/* Alert */}

    </div>
  );
}

export default App;
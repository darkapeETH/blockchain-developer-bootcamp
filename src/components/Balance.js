import DarkApe from '../assets/DarkApe.png'
import { useSelector , useDispatch } from 'react-redux'
import { loadBalances, transferTokens } from '../store/interactions'
import { useEffect, useState } from 'react'

const Balance = () => {
  const dispatch = useDispatch()
  const symbols = useSelector(state => state.tokens.symbols)
  const exchange = useSelector(state => state.exchange.contract)
  const tokens = useSelector(state => state.tokens.contracts)
  const account = useSelector(state => state.provider.account)
  const tokenBalances = useSelector(state => state.tokens.balances)
  const exchangeBalances = useSelector(state => state.exchange.balances)
  const provider = useSelector(state => state.provider.connection)

  const [token1TransferAmout, setToken1TransferAmout] = useState(0)
  const amountHandler = (e, token) => {
    if (token.address === tokens[0].address){
      setToken1TransferAmout(e.target.value)
    }
    console.log(token1TransferAmout)
  }

  const depositHandler = (e, token) => {
    e.preventDefault()
    if (token.address === tokens[0].address){
      transferTokens(provider, exchange, "Deposit", tokens[0], token1TransferAmout, dispatch)
    }
  }

    useEffect(() => {
      if(exchange && tokens[0] && tokens[1] && account) {
        loadBalances(exchange, tokens, account, dispatch)
      }
    }, [exchange, tokens, account])

  return (
    <div className='component exchange__transfers'>
      <div className='component__header flex-between'>
        <h2>Balance</h2>
        <div className='tabs'>
          <button className='tab tab--active'>Deposit</button>
          <button className='tab'>Withdraw</button>
        </div>
      </div>

      {/* Deposit/Withdraw Component 1 (DApp) */}

      <div className='exchange__transfers--form'>
        <div className='flex-between'>
          <p><small>Token</small><br /><img src={DarkApe} className = "logoicon" alt="Token Logo" />{symbols && symbols[0]} Token</p>
          <p><small>Wallet Amount</small><br /> {tokenBalances && tokenBalances[0]}</p>
          <p><small>Deposited on Exchange</small><br /> {exchangeBalances && exchangeBalances[0]}</p> 
        </div>

        <form onSubmit={(e) => depositHandler(e, tokens[0])}>
          <label htmlFor="token0">{symbols && symbols[0]} Amount</label>
          <input type="text" id='token0' placeholder='0.0000' onChange={(e) => amountHandler(e, tokens[0])}/>


          <button className='button' type='submit'>
            <span>Deposit {symbols && symbols[0]} </span>
          </button>
        </form>
      </div>

      <hr />

      {/* Deposit/Withdraw Component 2 (mETH) */}

      <div className='exchange__transfers--form'>
        <div className='flex-between'>

        </div>

        <form>
          <label htmlFor="token1"></label>
          <input type="text" id='token1' placeholder='0.0000'/>

          <button className='button' type='submit'>
            <span></span>
          </button>
        </form>
      </div>

      <hr />
    </div>
  );
}

export default Balance;

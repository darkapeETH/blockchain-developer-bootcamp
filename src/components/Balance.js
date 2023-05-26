import DarkApe from '../assets/DarkApe.png'
import ETHsvg from '../assets/eth.svg'
import { useSelector , useDispatch } from 'react-redux'
import { loadBalances, transferTokens } from '../store/interactions'
import { useEffect, useState, useRef } from 'react'

const Balance = () => {
  const dispatch = useDispatch()
  const symbols = useSelector(state => state.tokens.symbols)
  const exchange = useSelector(state => state.exchange.contract)
  const tokens = useSelector(state => state.tokens.contracts)
  const account = useSelector(state => state.provider.account)
  const tokenBalances = useSelector(state => state.tokens.balances)
  const exchangeBalances = useSelector(state => state.exchange.balances)
  const provider = useSelector(state => state.provider.connection)
  const transferInProgress = useSelector(state => state.exchange.transferInProgress)

  const [isDeposit, setIsDeposit] = useState(true)
  const [token1TransferAmout, setToken1TransferAmout] = useState(0)
  const [token2TransferAmout, setToken2TransferAmout] = useState(1)  

  const depositRef = useRef(null)
  const withdrawRef = useRef(null)

  const amountHandler = (e, token) => {
    if (token.address === tokens[0].address){
      setToken1TransferAmout(e.target.value)
    } else {
      setToken2TransferAmout(e.target.value)      
    }
  }

  const depositHandler = (e, token) => {
    e.preventDefault()
    if (token.address === tokens[0].address){ 
      transferTokens(provider, exchange, 'Deposit', token, token1TransferAmout, dispatch)
      setToken1TransferAmout(0)
    } else {
      transferTokens(provider, exchange, 'Deposit', token, token2TransferAmout, dispatch)
      setToken2TransferAmout(0)   
    }
  }

  const tabHandler = (e) => {
    if(e.target.className !== depositRef.current.className) {
      e.target.className = 'tab tab--active'
      depositRef.current.className = 'tab'
      setIsDeposit(false)
    } else {
      e.target.className = 'tab tab--active'
      withdrawRef.current.className = 'tab'
      setIsDeposit(true) 
    }
  }

  //[x]step1 do transfer
  //[x]step2 notify app that transfer is pending
  //[x]step3 get confirmation from blockchain that transfer was successful
  //[x]step4 notify app that transfer was successful
  //[]step5 handle transfers fails and nofify app



  useEffect(() => {
    if(exchange && tokens[0] && tokens[1] && account) {
      loadBalances(exchange, tokens, account, dispatch)
    }
  }, [exchange, tokens, account, transferInProgress])

  return (
    <div className='component exchange__transfers'>
      <div className='component__header flex-between'>
        <h2>Balance</h2>
        <div className='tabs'>
          <button onClick={tabHandler} ref={depositRef} className='tab tab--active'>Deposit</button>
          <button onClick={tabHandler} ref={withdrawRef} className='tab'>Withdraw</button>
        </div>
      </div>

      {/* Deposit/Withdraw Component 1 (DARK) */}

      <div className='exchange__transfers--form'>
        <div className='flex-between'>
          <p><small>Token</small><br /><img src={DarkApe} className = "logoicon" alt="Token Logo" />{symbols && symbols[0]} Token</p>
          <p><small>Wallet Amount</small><br /> {tokenBalances && tokenBalances[0]}</p>
          <p><small>Deposited on Exchange</small><br /> {exchangeBalances && exchangeBalances[0]}</p> 
        </div>

        <form onSubmit={(e) => depositHandler(e, tokens[0])}>
          <label htmlFor="token0">{symbols && symbols[0]} Amount</label>
          <input 
            type="text" 
            id='token0' 
            placeholder='0.0000'
            value={token1TransferAmout === 0 ? '' : token1TransferAmout}
            onChange={(e) => amountHandler(e, tokens[0])}
          />
          <button className='button' type='submit'>
            {isDeposit ? (
              <span>Deposit {symbols && symbols[0]} </span>
              ) : (
              <span>Withdraw {symbols && symbols[0]} </span>
            )}
          </button>
        </form>
      </div>

      <hr />

      {/* Deposit/Withdraw Component 2 (mETH) */}

      <div className='exchange__transfers--form'>
        <div className='flex-between'>
          <p><small>Token</small><br /><img src={ETHsvg} className = "logoicon" alt="Token Logo" />{symbols && symbols[1]} Token</p>
          <p><small>Wallet Amount</small><br /> {tokenBalances && tokenBalances[1]}</p>
          <p><small>Deposited on Exchange</small><br /> {exchangeBalances && exchangeBalances[1]}</p> 
        </div>

        <form onSubmit={(e) => depositHandler(e, tokens[1])}>
          <label htmlFor="token1"></label>
          <input 
            type="text" 
            id='token1' 
            placeholder='0.0000'
            value={token2TransferAmout === 0 ? '' : token2TransferAmout}        
            onChange={(e) => amountHandler(e, tokens[1])}
          />

          <button className='button' type='submit'>
            {isDeposit ? (
              <span>Deposit {symbols && symbols[1]} </span>
              ) : (
              <span>Withdraw {symbols && symbols[1]} </span>
            )}          
          </button>
        </form>
      </div>

      <hr />
    </div>
  );
}

export default Balance;

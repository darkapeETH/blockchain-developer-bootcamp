// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./Darktoken.sol";

contract Exchange {

	// Track accounts
	address public feeAccount;
	uint256 public feePercent;
	mapping(address => mapping(address => uint256)) public tokens;

	event Deposit(address token, address user, uint256 amount, uint256 balance);

	constructor(address _feeAccount, uint256 _feePercent){
		feeAccount = _feeAccount;
		feePercent = _feePercent;
	}
	
	// ------------------------
	// DEPOSIT & WITHDRAW TOKEN

	function depositToken(address _token, uint256 _amount) public{
		// Transfer token to exchange
		require(Darktoken(_token).transferFrom(msg.sender, address(this), _amount));

		// Update user balance
		tokens [_token][msg.sender] = tokens[_token][msg.sender] + _amount;

		// Emit an event
		emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);

	}

	// Check Balances  
	function balanceOf(address _token, address _user) // its a wrapper function in solidity that checks values out of a mapping
		public
		view
		returns (uint256) 
	{
		return tokens[_token][_user];
	}

}



// Withdraw Tokens


// Make Orders

// Cancel Orders

// Fill Orders

// Charge Fees


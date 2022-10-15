// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./Darktoken.sol";

contract Exchange {

	// Track accounts
	address public feeAccount;
	uint256 public feePercent;
	mapping(address => mapping(address => uint256)) public tokens;
	mapping(uint256 => _Order) public orders;
	uint256 public orderCount;
	mapping(uint256 => bool) public orderCancelled; // true or false (boolean / bool)
	mapping(uint256 => bool) public orderFilled; 

	event Deposit(address token, address user, uint256 amount, uint256 balance);
	event Withdraw(address token, address user, uint256 amount, uint256 balance);
	event Order(uint256 id, address user, address tokenGet,	uint256 amountGet, address tokenGive, uint256 amountGive, uint256 timestamp);
	event Cancel(uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, uint256 timestamp);
	event Trade(uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, address creator, uint256 timestamp);


	// Orders Mapping / Struct (a way to model the order)
	struct _Order {
		//attributes of an order
		uint256 id; // Unique identifier for order
		address user; // User who made the order
		address tokenGet;
		uint256 amountGet;
		address tokenGive;
		uint256 amountGive;
		uint256 timestamp; // When order was created
	}


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
	// Withdraw Tokens
	function withdrawToken(address _token, uint256 _amount) public {
		// Ensure user has enough tokens to withdraw
		require(tokens[_token][msg.sender] >= _amount);

		// Transfer tokens to user
		Darktoken(_token).transfer(msg.sender, _amount);

		// // Update user balance
		tokens [_token][msg.sender] = tokens[_token][msg.sender] - _amount;

		// // Emit event
		emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);		
	}
	// Check Balances  
	function balanceOf(address _token, address _user) // its a wrapper function in solidity that checks values out of a mapping
		public
		view
		returns (uint256) 
	{
		return tokens[_token][_user];
	}


	// Make Orders
	function makeOrder(
		address _tokenGet, 
		uint256 _amountGet, 
		address _tokenGive, 
		uint256 _amountGive
	)public{
		// Require Token Balance before they make an order
		require(balanceOf(_tokenGive, msg.sender) >= _amountGive);

		// Instantiate a new order
		orderCount++; // ++ is the same that making orderCount = orderCount + 1
		orders[orderCount] = _Order(
			orderCount, 
			msg.sender,
			_tokenGet,
			_amountGet,
			_tokenGive,
			_amountGive,
			block.timestamp
		);
		// Emit event
		emit Order(
			orderCount, 
			msg.sender,
			_tokenGet,
			_amountGet,
			_tokenGive,
			_amountGive,
			block.timestamp
		);	
	}

// Cancel Orders

	function cancelOrder(uint256 _id) public {

		// Fetching the order
			// Read the order
		_Order storage _order = orders[_id]; //We always have to declare a data type when we are declaring a variable in solidity
											//but with solidity we have to tell it that we are pulling this order out of storage from the mapping. This is actually a Storage struct that is pulled out of the mapping that is writen to the blockchain.
		// Ensure the caller of the function is the owner of the order
		require(address(_order.user) == msg.sender); // one = assigns values, vs two == compares values.

		// Order must exist
		require(_order.id == _id);

		// Cancel the order
		orderCancelled[_id] = true;

		// Emit event
		emit Cancel(
			_order.id,
			msg.sender,
			_order.tokenGet,
			_order.amountGet,
			_order.tokenGive,
			_order.amountGive,
			block.timestamp
		);
	}
// Fill Orders
	
	function fillOrder(uint256 _id) public {

		// 1. Must be valid orderId
		require(_id >0 && _id <= orderCount, "Order does not exist");	
		// 2. Order can't be filled
		require(!orderFilled[_id]);
		// 3. Order can't be cancelled
		require(!orderCancelled[_id]);

		// Fetching the order
		_Order storage _order = orders[_id];

		// Execute the trade
		_trade(
			_order.id, 
			_order.user, 
			_order.tokenGet,
			_order.amountGet,
			_order.tokenGive,
			_order.amountGive
			);
		// Mark order as filled
		orderFilled[_order.id] = true;

	}

	function _trade(
		uint256 _orderId,
		address _user,
		address _tokenGet,
		uint256 _amountGet,
		address _tokenGive,
		uint256 _amountGive

		) internal {

			//Fee is paid by the user who filled the order (msg.sender)
			//Fee is deducted from _amountGet
			uint256 _feeAmount = (_amountGet * feePercent)/100;

			//Execute the trade
			// msg.sende is the user who filled the order, while _user is who created the order
			tokens[_tokenGet][msg.sender] = tokens[_tokenGet][msg.sender] - (_amountGet + _feeAmount);
			tokens[_tokenGet][_user] = tokens[_tokenGet][_user] + _amountGet;

			// Charge fees
			tokens[_tokenGet][feeAccount] = tokens[_tokenGet][feeAccount] + _feeAmount;

			tokens[_tokenGive][_user] = tokens[_tokenGive][_user] - _amountGive;
			tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender] + _amountGive;


		// Emit event
		emit Trade(
			_orderId,
			msg.sender,
			_tokenGet,
			_amountGet,
			_tokenGive,
			_amountGive,
			_user,
			block.timestamp
		);
	}
}

const { ethers } = require('hardhat'); //imports the ethers library from the hardhat library
const { expect } = require('chai');

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Darktoken', () => {
	let darktoken, accounts, deployer, receiver, exchange

	beforeEach( async () => {
		const Darktoken = await ethers.getContractFactory('Darktoken')
		darktoken = await Darktoken.deploy('Dark Token','DARK','1000000')		
		accounts = await ethers.getSigners()
		deployer = accounts[0]
		receiver = accounts[1]
		exchange = accounts[2]
	})

	describe('Deployment',() =>{
		const name = 'Dark Token'
		const symbol = 'DARK'
		const decimals = '18'
		const totalSupply = tokens('1000000')

		it('has correct name', async () => {
			expect(await darktoken.name()).to.equal(name)
		})
		it('has correct symbol', async () => {
			expect(await darktoken.symbol()).to.equal(symbol)
		})
		it('has 18 decimals', async () => {
			expect(await darktoken.decimals()).to.equal(decimals)
		})
		it('has correct totalSupply', async () => {
			expect(await darktoken.totalSupply()).to.equal(totalSupply)
		})
		it('assigns totalSupply to deployer', async () => {
			expect(await darktoken.balanceOf(deployer.address)).to.equal(totalSupply)
		})	
	})
	describe ('Sending Token', () => {
		let amount, transaction, result

		describe ('Success', () => {

			beforeEach(async () => {
				amount = tokens(100)
				transaction = await darktoken.connect(deployer).transfer(receiver.address, amount)
				result = await transaction.wait()
			})
			it('transfers token balances', async () => {
				expect(await darktoken.balanceOf(deployer.address)).to.equal(tokens(999900))
				expect(await darktoken.balanceOf(receiver.address)).to.equal(amount)
			})	
			it('emits a transfer event', async () => {
				const event = result.events[0]
				expect(event.event).to.equal('Transfer')

				const args = event.args
				expect(args.from).to.equal(deployer.address)
				expect(args.to).to.equal(receiver.address)
				expect(args.value).to.equal(amount)
			})
		})
		describe ('Failure', () => {
			it('rejects insufficient balances', async () => {
				const invalidAmount = tokens(100000000)
				await expect(darktoken.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted
			})
			it('rejects invalid recipent', async () => {
				const amount = tokens(100)
				await expect(darktoken.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
			})
		})
	})
	describe('Approveing Tokens',  () => {

		let amount, transaction, result

		beforeEach(async () => {
			amount = tokens(100)
			transaction = await darktoken.connect(deployer).approve(exchange.address, amount)
			result = await transaction.wait()
		})

		describe('Success', () => {
			it('allocates an allowance for delegated token spending', async () => {
				expect(await darktoken.allowance(deployer.address, exchange.address)).to.equal(amount)
			})
			it('emits an approval event', async () => {
				const event = result.events[0]
				expect(event.event).to.equal('Approval')

				const args = event.args
				expect(args.owner).to.equal(deployer.address)
				expect(args.spender).to.equal(exchange.address)
				expect(args.value).to.equal(amount)
			})
		})

		describe('Failure', () => {
			it('rejects invalid spenders', async () => {
				await expect(darktoken.connect(deployer).approve('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
 			})
		})
	})

})

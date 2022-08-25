const { ethers } = require('hardhat'); //imports the ethers library from the hardhat library
const { expect } = require('chai');

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Darktoken', () => {
	let darktoken
	let accounts
	let deployer

	beforeEach( async () => {
		const Darktoken = await ethers.getContractFactory('Darktoken')
		darktoken = await Darktoken.deploy('Dark Token','DARK','1000000')		
		accounts = await ethers.getSigners()
		deployer = accounts[0]
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
			console.log(deployer.address)
			expect(await darktoken.balanceOf(deployer.address)).to.equal(totalSupply)
		})	
	})
})

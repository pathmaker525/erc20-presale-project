const Token = artifacts.require("RE_Token")
const PreSale = artifacts.require("RE_PreSale")

const { expect, assert } = require("./setupchai.js")
const BN = web3.utils.BN

const {
  ether,
  transferOwnership,
  expectInvalidOpcode,
  makeTransaction,
} = require("./helpers.js")

require("dotenv").config({ path: "./.env" })

contract("Real Estate Project Test", async (accounts) => {
  const [investor, receiver, receiver_2, hacker_1, hacker_2] = accounts

  const smallInvestment = ether(0.5)
  const hugeInvestment = ether(100)
  const softCap = ether(2500)
  const hardCap = ether(4000)
  const transfer = new BN(150000000000000)
  const newRate = 10
  const poolPercentage = 5

  describe("Ownership", async () => {
    it("of Token should initially belong to contract caller", async () => {
      const instance = await Token.deployed()
      console.log(instance.address)
      const owner = await instance.owner.call()
      assert.equal(owner, investor)
    })
    it("of Token should not be transferable by non-owner", async () => {
      const instance = await Token.deployed()
      console.log(instance.address)
      await expectInvalidOpcode(transferOwnership(instance, hacker_1, hacker_2))
    })
    it("of PreSale should initially belong to contract caller", async () => {
      const instance = await PreSale.deployed()
      console.log(instance.address)
      const owner = await instance.owner.call()
      assert.equal(owner, investor)
    })
    it("of PreSale should not be transferable by non-owner", async () => {
      const instance = await PreSale.deployed()
      console.log(instance.address)
      await expectInvalidOpcode(transferOwnership(instance, hacker_1, hacker_2))
    })
  })

  describe("Tokens", async () => {
    it("all should initially be in owners account", async () => {
      const instance = await Token.deployed()
      await expect(
        instance.balanceOf(investor)
      ).to.eventually.be.a.bignumber.equal(await instance.totalSupply())
    })
    it("transfer to or from blacklisted address will be rejected", async () => {
      const instance = await Token.deployed()
      await expect(instance.setAddressAsBlacklisted(hacker_1)).to.eventually.be
        .fulfilled
      await expect(instance.transfer(hacker_1, transfer)).to.eventually.be
        .rejected
    })
    it("transfer to or from whitelisted address will be fulfilled", async () => {
      const instance = await Token.deployed()
      await expect(instance.setAddressAsWhitelisted(receiver)).to.eventually.be
        .fulfilled
      await expect(instance.transfer(receiver, transfer)).to.eventually.be
        .fulfilled
      await expect(instance.transfer(receiver_2, transfer)).to.eventually.be
        .rejected
    })
    it("should be able to transfer between accounts", async () => {
      const instance = await Token.deployed()
      await expect(instance.setAddressAsWhitelisted(receiver)).to.eventually.be
        .fulfilled
      await expect(instance.transfer(receiver, transfer)).to.eventually.be
        .fulfilled
      await expect(
        instance.balanceOf(receiver)
      ).to.eventually.be.a.bignumber.equal(transfer)
    })
  })

  // describe("Pre-Sale", async () => {
  //   it("should allow admin to reset Rate", async () => {
  //     const token = await Token.deployed()
  //     const instance = await PreSale.new(5, investor, token.address)
  //     await expect(instance.setRate(newRate)).to.eventually.be.fulfilled
  //     await expect(instance.getRate()).to.eventually.be.equal(newRate)
  //   })
  //   it("ICO starts", async () => {
  //     const instance = await PreSale.deployed()
  //     const token = await Token.deployed()
  //     console.log(token.address)
  //     const tTotal = await token.totalSupply()
  //     await expect(
  //       instance.startICO(
  //         1630376078,
  //         smallInvestment,
  //         hugeInvestment,
  //         tTotal,
  //         softCap,
  //         hardCap,
  //         poolPercentage
  //       )
  //     ).to.eventually.be.fulfilled
  //   })
  // })
})

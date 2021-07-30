const RE_Presale = artifacts.require("RE_Presale")
const RE_Token = artifacts.require("RE_Token")

const chai = require("./setupchai.js")
const BN = web3.utils.BN
const expect = chai.expect

require("dotenv").config({ path: "./.env" })

contract("Real Estate Token Presale Test", async (accounts) => {
  const [deployerAccount, recipient] = accounts

  beforeEach(async () => {
    console.log(deployerAccount)
    console.log(recipient)
    this.testToken = await RE_Token.new()
    this.testPresale = await RE_Presale.new()
  })

  it("")
})

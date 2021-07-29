const RE_Token = artifacts.require("RE_Token")

require("dotenv").config({ path: "./.env" })

contract("Real Estate Token Test", async (accounts) => {
  const [deployerAccount, recipient, anotherAccount] = accounts

  beforeEach(async () => {
    print(deployerAccount)
    print(recipient)
    this.testToken = await RE_Token.new()
  })
})

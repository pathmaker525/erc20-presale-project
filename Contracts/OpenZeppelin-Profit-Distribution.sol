// SPDX-License-Identifier: Unlicensed

/**
 * $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$&&&&&$$$$$$$$$$$ *
 *                                                        *
 * DDD  III  SS  TTT RRR  III BBB  U  U TTT III  OO  N  N *
 * D  D  I  S__   T  R  R  I  BBB  U  U  T   T  O  O NN N *
 * D  D  I     S  T  RRR   I  B  B U  U  T   T  O  O N NN *
 * DDD  III  SS   T  R  R III BBB   UU   T  TTT  OO  N  N *
 *                                                        *
 * $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ *
 */


pragma solidity 0.8.6;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Profit_Distribution is Ownable {

  using SafeMath for uint256;
  using Address for address;

  // Ethereum: 0xdac17f958d2ee523a2206206994597c13d831ec7
  // Binance SC: 0x55d398326f99059fF775485246999027B3197955 (BSC_USD)
  // BSC Testnet: 0xBA6670261a05b8504E8Ab9c45D97A8eD42573822
  IERC20 private usdtToken = IERC20(0xBA6670261a05b8504E8Ab9c45D97A8eD42573822);

  address public _wallet;
  address[] private _holders;
  IERC20 private _token;

  uint256 availableBalance;

  event TransferUSDT(address holder, uint256 amount);

  constructor (address wallet, address[] memory holders, IERC20 token) {

    require(wallet != address(0), "Error: Wallet address can't be the zero address!");
    require(holders.length > 0, "Error: Should keep at least one holder!");
    require(address(token) != address(0), "Error: Token address can't be the zero Address!");

    _wallet = wallet;
    _holders = holders;
    _token = token;
  }

  function distrubuteProfit() public onlyOwner {

    availableBalance = usdtToken.balanceOf(_wallet);

    _distributeProfit(availableBalance);
  }

  function _distributeProfit(uint256 usdtAmount) internal {

    uint256 totalSupply = _token.totalSupply();
    uint256 remainBalance = usdtAmount;
    for(uint256 i = 0; i < _holders.length ; i++) {

      uint256 _rate = _getRating(_holders[i], totalSupply);
      if(i == _holders.length - 1) {
        usdtToken.transferFrom(payable(_wallet), payable(_holders[i]), usdtAmount.div(_rate));
        remainBalance = remainBalance - usdtAmount.div(_rate);

        emit TransferUSDT(_holders[i], usdtAmount.div(_rate));
      } else {

        usdtToken.transferFrom(payable(_wallet), payable(_holders[i]), remainBalance);

        emit TransferUSDT(_holders[i], remainBalance);
      }
    }
  }

  function _getRating(address holder, uint256 totalSupply) internal view returns (uint256){

    require(holder != address(0), "Error: Holder address can't be the zero address!");

    uint256 tHolding = _token.balanceOf(holder);
    return (totalSupply / tHolding);
  }
}

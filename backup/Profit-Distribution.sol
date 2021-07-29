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

abstract contract Context {

    constructor () { }

    function _msgSender() internal view returns (address) {

        return msg.sender;
    }

    function _msgData() internal view returns (bytes memory) {

        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

abstract contract Ownable is Context {

    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor () {

        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    function owner() public view returns (address) {

        return _owner;
    }

    modifier onlyOwner() {

        require(isOwner(), "Ownable: caller is not the owner");
        _;
    }

    function isOwner() public view returns (bool) {

        return _msgSender() == _owner;
    }

    function renounceOwnership() public onlyOwner {

        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    function transferOwnership(address newOwner) public onlyOwner {

        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal {

        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

library Address {

    function isContract(address account) internal view returns (bool) {

        bytes32 codehash;
        bytes32 accountHash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        // solhint-disable-next-line no-inline-assembly
        assembly { codehash := extcodehash(account) }
        return (codehash != accountHash && codehash != 0x0);
    }

    function toPayable(address account) internal pure returns (address) {

        return address(uint160(account));
    }

    function sendValue(address payable recipient, uint256 amount) internal {

        require(address(this).balance >= amount, "Address: insufficient balance");

        // solhint-disable-next-line avoid-low-level-calls, avoid-call-value
        (bool success, ) = recipient.call{ value: amount }("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }
}

interface IERC20 {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

library SafeMath {

    function add(uint256 a, uint256 b) internal pure returns (uint256) {

        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {

        return sub(a, b, "SafeMath: subtraction overflow");
    }

    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {

        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {

        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }


    function div(uint256 a, uint256 b) internal pure returns (uint256) {

        return div(a, b, "SafeMath: division by zero");
    }

    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {

        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {

        return mod(a, b, "SafeMath: modulo by zero");
    }

    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {

        require(b != 0, errorMessage);
        return a % b;
    }
}

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

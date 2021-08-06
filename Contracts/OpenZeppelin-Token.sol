// SPDX-License-Identifier: Unlicensed

/**   __
 *  _|__\_  ______
 * | @@@@ \ $$$$$$\             ____________
 * | @@@@ \     $$\            |$$$$$$$$$$$$\
 * | @@@@ \    $$ \            |$$$       $$\
 * | @@@@ \   $$   \______                   ________________________________
 * | @@@@ \  $$    $$$$$$$\    $   $ $$ $$  |$$$$$ $$$$$$   $   $$$$$$ $$$$$$\
 * | @@@@ \ $$     $$         $$$  $ $$ $$  |$$      $$    $$$    $$   $$    \
 * | @@@@ \  $$$   $$$$$$$|  $$ $$   $$     |$$$$$   $$   $$ $$   $$   $$$$  \
 * | @@@@ \   $$$  $$       $$$$$$$  $$   $$    $$   $$   $$$$$   $$   $$    \
 * | @@@@ \    $$$ $$$$$$$ $$     $$ $$$$$$$ $$$$$   $$  $$   $$  $$   $$$$$$\
 * |______\     $$$$ _____|  $_____________$
 */

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ERC20 is Context, IERC20, Ownable {

    using SafeMath for uint256;

    mapping (address => uint256) private _balances;

    mapping (address => bool) private _isBlacklisted;
    mapping (address => bool) private _isWhitelisted;

    mapping (address => mapping (address => uint256)) private _allowances;

    uint256 private _totalSupply;

    constructor () {
        _isWhitelisted[address(this)] = true;
        _isWhitelisted[owner()] = true;
    }

    function totalSupply() public override view returns (uint256) {

        return _totalSupply;
    }

    function balanceOf(address account) public override view returns (uint256) {

        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {

        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public override view returns (uint256) {

        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public override returns (bool) {

        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {

        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "ERC20: transfer amount exceeds allowance"));
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {

        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {

        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {

        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        require(_isBlacklisted[sender] == false && _isBlacklisted[recipient] == false, "Blacklisted addresses can't do buy or sell");
        require(_isWhitelisted[sender] == true && _isWhitelisted[recipient] == true, "Only whitelisted addresses can do buy or sell");

        _balances[sender] = _balances[sender].sub(amount, "ERC20: transfer amount exceeds balance");
        _balances[recipient] = _balances[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
    }

    function _mint(address account, uint256 amount) internal {

        require(account != address(0), "ERC20: mint to the zero address");

        _totalSupply = _totalSupply.add(amount);
        _balances[account] = _balances[account].add(amount);
        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal {

        require(account != address(0), "ERC20: burn from the zero address");

        _balances[account] = _balances[account].sub(amount, "ERC20: burn amount exceeds balance");
        _totalSupply = _totalSupply.sub(amount);
        emit Transfer(account, address(0), amount);
    }

    function _approve(address owner, address spender, uint256 amount) internal {

        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _burnFrom(address account, uint256 amount) internal {

        _burn(account, amount);
        _approve(account, _msgSender(), _allowances[account][_msgSender()].sub(amount, "ERC20: burn amount exceeds allowance"));
    }

    function setAddressAsBlacklisted(address account) public onlyOwner {
        _isBlacklisted[account] = true;
    }

    function unsetAddressFromBlacklisted(address account) public onlyOwner {
        _isBlacklisted[account] = false;
    }

    function setAddressAsWhitelisted(address account) public onlyOwner {
        _isWhitelisted[account] = true;
    }

    function unsetAddressFromWhitelisted(address account) public onlyOwner {
        _isWhitelisted[account] = false;
    }
}

contract RE_Token is ERC20 {

    string constant public name = "DEMORE";
    string constant public symbol = "DRE";
    uint8 constant public decimals = 18;
    uint256 constant public initialSupply = 566 * 10**18;

    constructor () {

        _mint(msg.sender, initialSupply);
    }
}

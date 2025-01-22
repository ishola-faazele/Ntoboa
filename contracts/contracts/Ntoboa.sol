// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import "hardhat/console.sol";

error InsufficientBalance(uint balance, uint amount);
error CharityDoesNotExist(uint id);
error NotCharityOwner(address caller, address owner);
error InvalidTarget();
error ZeroAddress();

contract Ntoboa {
    uint256 public totalAmountRaised;
    uint256 public nextCharityId;

    struct Charity {
        string name;
        string description;
        uint256 target;
        uint256 amountRaised;
        address owner;
        bool exists;
    }

    mapping(uint256 => Charity) public charities;

    event CharityCreated(
        uint256 indexed id,
        string name,
        string description,
        uint256 target,
        address owner
    );
    event DonationReceived(
        uint256 indexed charityId,
        address indexed donor,
        uint256 amount
    );
    event WithdrawalMade(
        uint256 indexed charityId,
        address indexed owner,
        uint256 amount
    );
    event EtherReceived(address sender, uint256 amount);

    modifier charityExists(uint256 _id) {
        if (!charities[_id].exists) {
            revert CharityDoesNotExist(_id);
        }
        _;
    }

    modifier onlyCharityOwner(uint256 _id) {
        if (charities[_id].owner != msg.sender) {
            revert NotCharityOwner(msg.sender, charities[_id].owner);
        }
        _;
    }

    function addCharity(
        string calldata name, // Changed to calldata
        string calldata description,
        uint256 _target
    ) external {
        if (_target == 0) revert InvalidTarget();

        uint256 charityId = nextCharityId++;

        charities[charityId] = Charity({
            name: name,
            description: description,
            target: _target,
            amountRaised: 0,
            owner: msg.sender,
            exists: true
        });

        emit CharityCreated(charityId, name, description, _target, msg.sender);
    }

    function donate(uint256 _id) external payable charityExists(_id) {
        if (msg.value == 0) revert InsufficientBalance(msg.value, 0);

        totalAmountRaised += msg.value;
        charities[_id].amountRaised += msg.value;

        emit DonationReceived(_id, msg.sender, msg.value);
    }

    function withdraw(
        uint256 _id
    ) external charityExists(_id) onlyCharityOwner(_id) {
        Charity storage charity = charities[_id];
        uint256 amount = charity.amountRaised;

        if (amount == 0) revert InsufficientBalance(0, 0);

        charity.amountRaised = 0;

        // Checks-Effects-Interactions pattern
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        emit WithdrawalMade(_id, msg.sender, amount);
    }

    function getBalanceOf(
        uint256 _id
    ) external view charityExists(_id) returns (uint256) {
        return charities[_id].amountRaised;
    }

    receive() external payable {
        emit EtherReceived(msg.sender, msg.value);
    }
}

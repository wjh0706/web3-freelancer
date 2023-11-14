// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Web3Auth
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_web3.ts
 */
contract Web3Auth {
    mapping(address => bool) public users;

    event UserSignup(address indexed user);
    
    function signup() external {
        require(!users[msg.sender], "User already exists");
        users[msg.sender] = true;
        emit UserSignup(msg.sender);
    }

    function isUserSignedUp() external view returns (bool) {
        return users[msg.sender];
    }

    function getUserAddress() external view returns (address) {
        return msg.sender;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Ownable {
    // State Variables
    address owner;

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
    }
}

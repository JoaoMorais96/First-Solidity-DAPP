// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract ChainList {
    //Variables
    address seller;
    string name;
    string description;
    uint256 price;

    //Sell an article
    function sellArticle(
        string memory _name,
        string memory _description,
        uint256 _price
    ) public {
        seller = msg.sender;
        name = _name;
        description = _description;
        price = _price;
    }

    //Get an article
    function getArticle()
        public
        view
        returns (
            address _seller,
            string memory _name,
            string memory _description,
            uint256 _price
        )
    {
        return (seller, name, description, price);
    }
}

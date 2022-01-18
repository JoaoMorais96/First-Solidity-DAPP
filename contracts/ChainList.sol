// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract ChainList {
    //Variables
    address seller;
    address buyer;
    string name;
    string description;
    uint256 price;

    //Events
    event logSellArticle(address indexed _seller, string _name, uint256 _price);
    event logBuyArticle(
        address indexed _seller,
        address indexed _buyer,
        string _name,
        uint256 _price
    );

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
        emit logSellArticle(msg.sender, name, price);
    }

    //Get an article
    function getArticle()
        public
        view
        returns (
            address _seller,
            address _buyer,
            string memory _name,
            string memory _description,
            uint256 _price
        )
    {
        return (seller, buyer, name, description, price);
    }

    //buy an article
    function buyArticle() public payable {
        //See if there is an article for sale
        require(seller != address(0x0));

        //we check that the article has not been sold
        require(buyer == address(0x0));

        //we don't allow the seller to buy his own product
        require(msg.sender != seller);

        //we check that the value sent corresponds to the price of the article
        require(msg.value == price);

        //Keep buyers information
        buyer = msg.sender;

        //The buyer can pay the seller
        payable(seller).transfer(msg.value);

        //trigger event
        emit logBuyArticle(seller, buyer, name, price);
    }
}

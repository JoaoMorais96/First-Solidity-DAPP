// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract ChainList {
    //Custom types
    struct Article {
        uint256 id;
        address seller;
        address buyer;
        string name;
        string description;
        uint256 price;
    }

    // State Variables
    mapping(uint256 => Article) public articles;
    uint256 articleCounter = 0;

    //Events
    event logSellArticle(
        uint256 indexed _id,
        address indexed _seller,
        string _name,
        uint256 _price
    );
    event logBuyArticle(
        uint256 indexed _id,
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
        articleCounter++;
        articles[articleCounter] = Article(
            articleCounter,
            msg.sender,
            address(0x0),
            _name,
            _description,
            _price
        );

        emit logSellArticle(articleCounter, msg.sender, _name, _price);
    }

    // Fetch number of articles
    function getNumberOfArticles() public view returns (uint256) {
        return articleCounter;
    }

    //Fetch and return all article ids for articles still for sale
    // fetch and returns all article IDs available for sale
    function getArticlesForSale() public view returns (uint256[] memory) {
        // we check whether there is at least one article
        if (articleCounter == 0) {
            return new uint256[](0);
        }

        // prepare output arrays
        uint256[] memory articleIds = new uint256[](articleCounter);

        uint256 numberOfArticlesForSale = 0;
        // iterate over articles
        for (uint256 i = 1; i <= articleCounter; i++) {
            // keep only the ID for the article not already sold
            if (articles[i].buyer == address(0x0)) {
                articleIds[numberOfArticlesForSale] = articles[i].id;
                numberOfArticlesForSale++;
            }
        }

        // copy the articleIds array into the smaller forSale array
        uint256[] memory forSale = new uint256[](numberOfArticlesForSale);
        for (uint256 j = 0; j < numberOfArticlesForSale; j++) {
            forSale[j] = articleIds[j];
        }
        return forSale;
    }

    //buy an article
    function buyArticle(uint256 _id) public payable {
        //See if there is an article for sale
        require(articleCounter > 0);

        //We check if article exists
        require(_id > 0 && _id <= articleCounter);

        //Retrieve article from the mapping
        Article storage article = articles[_id];

        //we check that the article has not been sold
        require(article.buyer == address(0x0));

        //we don't allow the seller to buy his own product
        require(msg.sender != article.seller);

        //we check that the value sent corresponds to the price of the article
        require(msg.value == article.price);

        //Keep buyers information
        article.buyer = msg.sender;

        //The buyer can pay the seller
        payable(article.seller).transfer(msg.value);

        //trigger event
        emit logBuyArticle(
            article.id,
            article.seller,
            article.buyer,
            article.name,
            article.price
        );
    }
}

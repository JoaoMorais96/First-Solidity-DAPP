var ChainList = artifacts.require("./contracts/ChainList.sol");

// test suite
contract('ChainList', function(accounts){
  var chainListInstance;
  var seller = accounts[1];
  var buyer = accounts[2];
  var articleName = "article 1";
  var articleDescription = "Description for article 1";
  var articlePrice = 10;
  var sellerBalanceBeforeBuy, sellerBalanceAfterBuy;
  var buyerBalanceBeforeBuy, buyerBalanceAfterBuy;

  it("should be initialized with empty values", function() {
    return ChainList.deployed().then(function(instance) {
      return instance.getArticle();
    }).then(function(data) {
      assert.equal(data[0], 0x0, "seller must be empty");
      assert.equal(data[1], 0x0, "buyer must be empty");
      assert.equal(data[2], "", "article name must be empty");
      assert.equal(data[3], "", "article description must be empty");
      assert.equal(data[4].toNumber(), 0, "article price must be zero");
    })
  });

  it("should sell an article", function() {
    return ChainList.deployed().then(function(instance) {
      chainListInstance = instance;
      return chainListInstance.sellArticle(articleName, articleDescription, web3.utils.toWei(String(articlePrice), "ether"), { from: seller});
    }).then(function() {
      return chainListInstance.getArticle();
    }).then(function(data) {
      assert.equal(data[0], seller, "seller must be " + seller);
      assert.equal(data[1], 0x0, "buyer must be empty");
      assert.equal(data[2], articleName, "article name must be " + articleName);
      assert.equal(data[3], articleDescription, "article description must be " + articleDescription);
      assert.equal(data[4], web3.utils.toWei(String(articlePrice), "ether"), "article price must be " + web3.utils.toWei(String(articlePrice), "ether"));
    });
  });

  it("should buy an article", function(){
    return ChainList.deployed().then(async function(instance) {
      chainListInstance = instance;
      // record balances of seller and buyer before the buy
      console.log(web3.eth.getBalance(seller));
      sellerBalanceBeforeBuy = web3.utils.fromWei(String(await web3.eth.getBalance(seller)), "ether");
      buyerBalanceBeforeBuy = web3.utils.fromWei(String(await web3.eth.getBalance(buyer)), "ether");
      return chainListInstance.buyArticle({
        from: buyer,
        value: web3.utils.toWei(String(articlePrice), "ether")
      });
    }).then(async function(receipt){ // after the the buyArticle transaction is mined into a block, we see if:
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");
      assert.equal(receipt.logs[0].event, "logBuyArticle", "event should be logBuyArticle");
      assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
      assert.equal(receipt.logs[0].args._buyer, buyer, "event buyer must be " + buyer);
      assert.equal(receipt.logs[0].args._name, articleName, "event article name must be " + articleName);
      assert.equal(receipt.logs[0].args._price, web3.utils.toWei(String(articlePrice), "ether"), "event article price must be " + web3.utils.toWei(String(articlePrice), "ether"));

      // record balances of buyer and seller after the buy
      sellerBalanceAfterBuy = web3.utils.fromWei(String( await web3.eth.getBalance(seller)), "ether");
      buyerBalanceAfterBuy = web3.utils.fromWei(String( await web3.eth.getBalance(buyer)), "ether");

      // check the effect of buy on balances of buyer and seller, accounting for gas 
      assert(Number(sellerBalanceAfterBuy) == Number(sellerBalanceBeforeBuy) + articlePrice, "seller should have earned " + articlePrice + " ETH");
      assert(Number(buyerBalanceAfterBuy) <= Number(buyerBalanceBeforeBuy) - articlePrice, "buyer should have spent " + articlePrice + " ETH");

      return chainListInstance.getArticle();
    }).then(function(data){
      assert.equal(data[0], seller, "seller must be " + seller);
      assert.equal(data[1], buyer, "buyer must be " + buyer);
      assert.equal(data[2], articleName, "article name must be " + articleName);
      assert.equal(data[3], articleDescription, "article description must be " + articleDescription);
      assert.equal(data[4], web3.utils.toWei(String(articlePrice), "ether"), "article price must be " + web3.utils.toWei(String(articlePrice), "ether"));
    });
  });

  it("should trigger an event when a new article is sold", function() {
    return ChainList.deployed().then(function(instance) {
      chainListInstance = instance;
      return chainListInstance.sellArticle(articleName, articleDescription, web3.utils.toWei(String(articlePrice), "ether"), {from: seller});
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");
      assert.equal(receipt.logs[0].event, "logSellArticle", "event should be logSellArticle");
      assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
      assert.equal(receipt.logs[0].args._name, articleName, "event article name must be " + articleName);
      assert.equal(receipt.logs[0].args._price, web3.utils.toWei(String(articlePrice), "ether"), "event article price must be " + web3.utils.toWei(String(articlePrice), "ether"));
    });
  });
});

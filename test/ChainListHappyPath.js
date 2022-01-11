var ChainList = artifacts.require("./ChainList.sol");

//Test Suite
contract('ChainList', function(accounts){
    var chainListInstance;
    var seller = accounts[1];
    var articleName= "article 1";
    var articleDescription= "Descr for article 1";
    var articlePrice= 10;



    it("Should be initialized with empty values", function(){
        return ChainList.deployed().then(function(instance) {
            return instance.getArticle();
        }).then(function(data) {
            assert.equal(data[0], 0x0, "Seller must be empty");
            assert.equal(data[1], "", "Article name must be empty");
            assert.equal(data[2], "", "Article discription must be empty");
            assert.equal(data[3].toNumber(), 0, "Article price must be zero");
        })
    });

    it("Should sell an article", function(){
        return ChainList.deployed().then(function(instance) {
            chainListInstance = instance;
            return chainListInstance.sellArticle(articleName, articleDescription, web3.utils.toWei(String(articlePrice), "ether"), {from: seller});
        }).then(function() {
            return chainListInstance.getArticle();
        }).then(function (data){
            assert.equal(data[0], seller, "Seller must " + seller);
            assert.equal(data[1], articleName, "Article name must be " + articleName);
            assert.equal(data[2], articleDescription, "Article discription must be " + articleDescription);
            assert.equal(data[3], web3.utils.toWei(String(articlePrice), "ether"), "Article price must be " + web3.utils.toWei(String(articlePrice), "ether"));
        })
    })
})
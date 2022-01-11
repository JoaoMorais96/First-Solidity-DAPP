App = {
     web3Provider: null,
     contracts: {},

     init: function() {
        //Load articles
        var articlesRow =$('#articlesRow');
        var articleTemplate = $('#articleTemplate');

        //Creating a product to sell
        articleTemplate.find('.panel-title').text('article 1')
        articleTemplate.find('.article-description').text('Description for article 1')
        articleTemplate.find('.article-price').text('10.23');
        articleTemplate.find('.article-seller').text('0x89273498356981724')

        //Add the articles content to the row of articles (articlesRow)
        articlesRow.append(articleTemplate.html());

          return App.initWeb3();
     },

     initWeb3: function() {
          /*
           * Replace me...
           */

          return App.initContract();
     },

     initContract: function() {
          /*
           * Replace me...
           */
     },
};

$(function() {
     $(window).load(function() {
          //Called when the page is open
          App.init();
     });
});

App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,
  flag:true,
  loading : false,
  name : "a",

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // initialize web3
    if(typeof web3 !== 'undefined') {
      //reuse the provider of the Web3 object injected by Metamask
      App.web3Provider = web3.currentProvider;
    } else {
      //create a new provider and plug it directly into our local node
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    App.displayAccountInfo();

  //  $('.ball_footballbox').prepend('<img id="theImg" src="https://animalso.com/wp-content/uploads/2017/01/Golden-Retriever_6.jpg" prepended="yes"/>')
    return App.initContract();
  },

  displayAccountInfo: function() {
    web3.eth.getCoinbase(function(err, account) {

      if(err === null) {
        App.account = account;
        $('#account').text(account);
        web3.eth.getBalance(account, function(err, balance) {
          if(err === null) {
            $('#accountBalance').text(web3.fromWei(balance, "ether") + " ETH");
          }
        })
      }

    }

  );
  },

  initContract: function() {
    $.getJSON('Renting.json', function(RentingArtifact) {
// get the contract artifact file and use it to instantiate a truffle contract abstraction
      App.contracts.Renting = TruffleContract(RentingArtifact);
      // set the provider for our contracts
      App.contracts.Renting.setProvider(App.web3Provider);
      // retrieve the article from the contract
      return App.reloadArticles();
    });
    $.getJSON('Notary.json',function(NotaryArtifiact){
      App.contracts.Notary = TruffleContract(NotaryArtifiact);
      // set the provider for our contracts
      App.contracts.Notary.setProvider(App.web3Provider);
      // retrieve the article from the contract
      //return App.reloadArticles();

    })
  },


  checkArticleID: function(){

        App.contracts.Renting.deployed().then(function(instance){
          RentingInstance = instance;
          return RentingInstance.getArticlesForSale();
        }).then(function(articleid){
          for(var i = 0; i < articleid.length; i++) {
                  var articleId2 = articleid[i];
                  RentingInstance.articles(articleId2.toNumber()).then(function(article){
                      var articleTemplate = $("#articleTemplate");
                      console.log("Paaji" + articleTemplate.find('.panel-title').text() + " sada" + article[3] )
                      if(articleTemplate.find('.panel-title').text()==article[3]){
                          console.log("saif");
                          return false;
                      }
                  })
                  console.log("loop");
          }

          return true;
        }).catch(function(err) {
          console.error(err.message);
          App.loading=false;
        });
  },


  reloadArticles: function() {

    // avoid reentry
     if(App.loading) {
       return;
     }
     App.loading = true;
    // refresh account information because the balance might have changed
    App.displayAccountInfo();
    var RentingInstance;
    // retrieve the article placeholder and clear it
  //  $('#articlesRow').empty();
  //  if(App.checkArticleID()==true){
  console.log(App.checkArticleID());
      App.contracts.Renting.deployed().then(function(instance) {
         RentingInstance = instance;
       return RentingInstance.getArticlesForSale();  //return arrays
     }).then(function(articleIds) {
       // retrieve the article placeholder and clear it
       $('#articlesRow').empty();
       console.log("The Answer is: " + articleIds);

       for(var i = 0; i < articleIds.length; i++) {
          var articleId = articleIds[i];
          RentingInstance.articles(articleId.toNumber()).then(function(article){
            var articleTemplate3 = $("#articleTemplate");
            var flag=0;
            var d = new Date();
            var year = d.getFullYear();
            var end = article[7];
            var end_year=end.substr(0,4);
            console.log("end "+ end);
            console.log("end year is"+ end_year);
            console.log("current year is" + year);
            var c = year - end_year;
            console.log("alajkfasjfanf " +c);
            if((App.CheckNotary(article[3]))===true){

              console.log("Hello : " + article[3]);
              articleTemplate3.find('.btn-buy').hide();
              $('.article-Notary').text("Notarised done");
            }

            console.log("Hello : " + article[3]);
            articleTemplate3.find('.Time-left').text(c);
            if(end_year!=year){
              console.log("Time Limit Expired");
                  App.displayArticle(article[0], article[1],article[2], article[3], article[4], article[5],article[6],article[7]);
                    flag=1;

            }
          });
        }
      App.loading=false;

    }).catch(function(err) {
      console.error(err.message);
      App.loading=false;
    });
  //}
  },

  checkProofArticles: function() {

    // avoid reentry
     if(App.loading) {
       return;
     }
     App.loading = true;
    // refresh account information because the balance might have changed
    App.displayAccountInfo();
    var RentingInstance;
    // retrieve the article placeholder and clear it
  //  $('#articlesRow').empty();
  //  if(App.checkArticleID()==true){
  console.log(App.checkArticleID());
      App.contracts.Renting.deployed().then(function(instance) {
         RentingInstance = instance;
       return RentingInstance.getArticlesForSale();  //return arrays
     }).then(function(articleIds) {
       // retrieve the article placeholder and clear it
       $('#articlesRow').empty();
       console.log("The Answer is: " + articleIds);

       for(var i = 0; i < articleIds.length; i++) {
          var articleId = articleIds[i];
          RentingInstance.articles(articleId.toNumber()).then(function(article){
            var articleTemplate3 = $("#articleTemplate");
            var flag=0;
            var d = new Date();
            var year = d.getFullYear();
            var end = article[7];
            var end_year=end.substr(0,4);
        //    console.log("end "+ end);
        //    console.log("end year is"+ end_year);
          //  console.log("current year is" + year);
            var c = year - end_year;
        //    console.log(c);
        //    articleTemplate3.find('.Time-left').text(c);
            App.CheckNotary(article[3]);
          //  if(end_year!=year){
          //    console.log("Time Limit Expired");
          //        App.displayArticle(article[0], article[1],article[2], article[3], article[4], article[5],article[6],article[7]);
          //          flag=1;

            //}
          });
        }
      App.loading=false;

    }).catch(function(err) {
      console.error(err.message);
      App.loading=false;
    });
  //}
  },



  displayArticle: function(id, seller,buyer, name, description, price,startdate,enddate) {
      var articlesRow = $('#articlesRow');

      var etherPrice = web3.fromWei(price, "ether");

      var articleTemplate = $("#articleTemplate");
      articleTemplate.find('.panel-title').text(name);
      articleTemplate.find('.article-description').text(description);
      articleTemplate.find('.article-price').text(etherPrice + " ETH");
      articleTemplate.find('.btn-buy').attr('data-id', id);
      articleTemplate.find('.btn-buy').attr('data-value', etherPrice);
      articleTemplate.find('.start-date').text(startdate);
      articleTemplate.find('.end-date').text(enddate);

      // seller

      articleTemplate.find('.article-seller').text(seller);
      if (seller == App.account) {
        //articleTemplate.find('.article-seller').text("you");
        articleTemplate.find('.btn-buy').hide();
        articleTemplate.find('.btn5').hide();
        articleTemplate.find('.btn6').hide();
      } else if(buyer==0x0) {
        articleTemplate.find('.btn-buy').show();
        articleTemplate.find('.btn5').hide();
        articleTemplate.find('.btn6').hide();
      }else{
        articleTemplate.find('.btn-buy').hide();
        articleTemplate.find('.btn5').show();
        articleTemplate.find('.btn6').show();
      }


    var c =1;
    if($.trim($(".img").html())==''){
          $(".img").prepend('<img src="image/Flat.jpg">');
        //  document.getElementById(".img").src = "image/Dog.png";
    }

      // add this new article
      articlesRow.append(articleTemplate.html());
    },


    notarize : function (flaty) {

      //h1 = $('#flats').val();
    //  console.log("Checking Notary : " + name);
      console.log("Name of Notarised ID ::" + flaty);
        App.contracts.Notary.deployed().then(function(instance){
            return instance.notarize(flaty);
        }).then(function(result){
        //    articleTemplate2.find('.Notary').text("HAS BEEN DIGITALLY NOTARIZED");
            console.log("OK Notarised");
            $('#Text').text("Notarised done");
            $('.article-Notary').text("Notarised done");
            $('.Text').text("Notarised done");
            return true;
        }).catch(function(err){
            console.log(err);
        })
    },


    CheckNotary : function(_flatname){

            console.log("Checking Notary : " + _flatname);
          App.contracts.Notary.deployed().then(function(instance){
                return instance.checkDocument(_flatname);
          }).then(function(result){
                if(result===false){
                  console.log("Going to Notarsdasize");
                  return false;
                }else{
                  console.log("NOT Going to Notarize");
                  return true;
                }
          }).catch(function(err) {
            console.error(err);
          })
    },

    Notary : function(){

    //  var h = $(event.target).data('article_name');
      var c = $('#flats').val();
      console.log("TExtbox is :" + c);
      App.contracts.Notary.deployed().then(function(instance){
          return instance.checkDocument(c);
      }).then(function(result){
          if(result===false){
            console.log("OK");
            App.notarize(c);
          }else{
            console.log("NOT OK");
            $('.Text').text("Notarised done");
            return false;
          }


      }).catch(function(err) {
        console.error(err);
      })
    },

  ProofForArticle: function() {
          App.contracts.Notary.deployed().then(function(instance){
            var _article_name = $('#article_name').val();
            console.log("SUCK");
            return instance.proofFor(_article_name);
          }).then(function(result){
              console.log(result);
          }).catch(function(err){
              console.error(err);
          })
      },

  sellArticle: function() {
    // retrieve the detail of the article
    var _article_name = $('#article_name').val();
    name=_article_name;
    console.log("The name is :" +name);
    var _description = $('#article_description').val();
    var _price = web3.toWei(parseFloat($('#article_price').val() || 0), "ether");
    var _start_date = $('#start_date').val();
    var _end_date = $('#end_date').val();

    if((_article_name.trim() == '') || (_price == 0)) {
      // nothing to sell
      return false;
    }

  //  if(App.CheckNotary()===true){
  //      console.log("Cannot Sell Already Rented flats");
  //      $('#Text').text("Cannot Sell Already Rented flats");
//        return false;
//    }
    console.log("After Selling");
    App.contracts.Renting.deployed().then(function(instance) {

      return instance.sellArticle(_article_name, _description, _price,_start_date,_end_date,{
        from: App.account,
        gas: 500000                 //Mined in blockcahin
      });
    }).then(function(result) {
      App.reloadArticles();
    }).catch(function(err) {
      console.error(err);
    });
  },


 buyArticle: function() {

     // retrieve the article price

     var _price = parseFloat($(event.target).data('value'));
     var _articleId = $(event.target).data('id');
     App.contracts.Renting.deployed().then(function(instance){
       return instance.buyArticle(_articleId,{
         from: App.account,
         value: web3.toWei(_price, "ether"),
         gas: 500000
       });
     }).catch(function(error) {
       console.error(error);
     });
   }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

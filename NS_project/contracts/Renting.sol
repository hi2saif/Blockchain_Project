pragma solidity ^0.4.18;

contract Renting {
  // state variables
  struct Article {
    uint id;
    address seller;
    address buyer;
    string name;
    string description;
    uint256 price;
    string startdate;
    string enddate;
  }

  mapping (uint => Article) public articles;
  uint articleCounter;

  // sell an article
  function sellArticle(string _name, string _description, uint256 _price,string _startdate,string _enddate) public {
    // a new article
    uint check=0;
    for(uint j=0; j<=articleCounter;j++){

      if(keccak256(articles[j].name)==keccak256(_name)){
        check=1;
      }
    }
    if(check==0){
    articleCounter++;

    // store this article
    articles[articleCounter] = Article(
      articleCounter,
      msg.sender,
      0x0,
      _name,
      _description,
      _price,
      _startdate,
      _enddate
    );
}
}
  // get an article



  // fetch the number of articles in the contract
    function getNumberOfArticles() public view returns (uint) {
      return articleCounter;
    }


  function getArticlesForSale() public view returns (uint[]) {
      // prepare output array
      uint[] memory articleIds = new uint[](articleCounter);

      uint numberOfArticlesForSale = 0;
      // iterate over articles
      for(uint i = 1; i <= articleCounter;  i++) {
        // keep the ID if the article is still for sale
      //  if(articles[i].buyer == 0x0) {
          articleIds[numberOfArticlesForSale] = articles[i].id;
          numberOfArticlesForSale++;
      //  }
      }

      // copy the articleIds array into a smaller forSale array
      uint[] memory forSale = new uint[](numberOfArticlesForSale);
      for(uint j = 0; j < numberOfArticlesForSale; j++) {
        forSale[j] = articleIds[j];
      }
      return forSale;
    }


  function buyArticle(uint _id) payable public {
    // we check whether there is an article for sale

    require(articleCounter > 0);

    // we check that the article exists
    require(_id > 0 && _id <= articleCounter);

    // we retrieve the article
    Article storage article = articles[_id];

    // we check that the article has not been sold yet
    require(article.buyer == 0X0);

    // we don't allow the seller to buy his own article
    require(msg.sender != article.seller);

    // we check that the value sent corresponds to the price of the article
    require(msg.value == article.price);

    // keep buyer's information
    article.buyer = msg.sender;

    // the buyer can pay the seller
    article.seller.transfer(msg.value);

    // trigger the event

  }
}

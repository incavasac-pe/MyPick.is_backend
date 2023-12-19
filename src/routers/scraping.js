const express = require("express");
const router = express.Router();
 const { newResponseJson } = require('../responseUtils');
const axios = require('axios');  

router.get('/list_products_api_externa', async (req, res) => {
  const response = newResponseJson();
  let status = 400; 
  response.error = true; 
  const search = req.query.search;
  
  let data = JSON.stringify({
    query: `query MyQuery {
    amazonProductSearchResults(input: {searchTerm: "${search}", domain: US}) {
      productResults(input: {}) {
        results {
          imageUrls
          price {
            value
          }
          title
          url
        }
      }
    }
  }`,
    variables: {}
  }); 
  
  let config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: 'https://graphql.canopyapi.co',
    headers: { 
      'Content-Type': 'application/json', 
      'API-KEY': 'abe684f2-c3ac-4099-bbbf-d3a1fe264336'
    },
    data : data
  };

    axios.request(config)
    .then((response1) => {
      status = 200 
      const resp = response1.data?.data 
      response.data = resp.amazonProductSearchResults?.productResults?.results
      res.status(status).json(response)
    
    })
    .catch((error) => {
      console.log(error);
      res.status(status).json(response)
    });
          
});

router.get('/list_products_api_externa_new', async (req, res) => {
  const response = newResponseJson();
  let status = 400; 
  response.error = true; 
  const search = req.query.search; 
 try {

  const options = {
    method: 'GET',
    url: 'https://amazon-price1.p.rapidapi.com/search',
    params: {
      keywords:search,
      marketplace: 'US'
    },
    headers: {
      'X-RapidAPI-Key': '22913f82f7mshfb58b1d46e4ecf7p1f6f8fjsn879ce3efc174',
      'X-RapidAPI-Host': 'amazon-price1.p.rapidapi.com'
    }
  };
 // Nuevo objeto a agregar
const newObj = {
  ASIN: "QWEQWE",
  title: "SELECT",
  price: "0.0",
  listPrice: "",
  imageUrl: "https://m.media-amazon.com/images/QWE.jpg",
  detailPageURL: "https://www.amazon.es/dp/QWEQWE"
};

	const produc = await axios.request(options);
    response.data = produc.data
    response.data.unshift(newObj);
    res.status(status).json(response)
  } catch (error) {
    console.error(error);
    res.status(status).json(response)
  }
    
    
});
module.exports = router; 
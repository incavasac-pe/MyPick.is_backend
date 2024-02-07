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
 
//se agrega nueva api 04/02 nn
router.get('/list_products_api_externa_new', async (req, res) => {
  const response = newResponseJson();
  let status = 400; 
  response.error = true; 
  const search = req.query.search; 
 try {

  const options = {
    method: 'GET',
    url:  process.env.URL_AMAZON,
    params: {     
     query: search,
     page: '1',
     country: 'US',
     category_id: 'aps'
    },
    headers: {
      'X-RapidAPI-Key': process.env.API_KEY_AMAZON,
      'X-RapidAPI-Host':  process.env.HOST_AMAZON,
    }
  };


	const produc = await axios.request(options);
  if(produc.data.status == 'OK' && produc.data.data){   
     status = 200
     response.data = await adjustProductData(produc.data.data.products)  
  } 
  res.status(status).json(response)
  } catch (error) {
    console.error(error);
    res.status(status).json(response)
  }    
    
});

 
async function adjustProductData(products) {
  const adjustedProducts = [ // Nuevo objeto a agregar
];
  products.forEach((product) => {
    const adjustedProduct = {
      imageUrl: product.product_photo,
      detailPageURL: product.product_url,
      title: product.product_title,
      asin: product.asin,
      product_price: product.product_price,
    /*  product_original_price: product.product_original_price,
      currency: product.currency,
      product_star_rating: product.product_star_rating,
      product_num_ratings: product.product_num_ratings,
      product_num_offers: product.product_num_offers,
      product_minimum_offer_price: product.product_minimum_offer_price,
      is_best_seller: product.is_best_seller,
      is_amazon_choice: product.is_amazon_choice,
      is_prime: product.is_prime,
      climate_pledge_friendly: product.climate_pledge_friendly,
      sales_volume: product.sales_volume,
      delivery: product.delivery,*/
    };
    adjustedProducts.push(adjustedProduct);
  });
  return adjustedProducts;
}
module.exports = router; 

const cheerio = require('cheerio');
const axios = require('axios'); 


const scrapeUrl = async (url) => {
    console.log("url: ", url);
  return await axios.get(url).then(async (response) => { 
        const body = response.data; 
        const $ = cheerio.load(body); // Load HTML data and initialize cheerio 
       return await getProductDetails($) 
    });
} 

const getProductDetails = async ($) => {

    let title = $('.product-title-word-break').text();
    let inStock = $('#availability').text();
    let price, ratingCount, rating = '';

    if (inStock.indexOf('Currently unavailable')) {
        price = $('.priceToPay').find('.a-price-whole').text();
        ratingCount = $('#acrCustomerReviewText').text();
        rating = $('.reviewCountTextLinkedHistogram').attr('title');
    }

    return {name: title.trim(), price: price, rating:rating , ratingCount: ratingCount, inStock: inStock.trim(), priceFetchedAt: (new Date()).toLocaleString()};
}


module.exports = scrapeUrl;

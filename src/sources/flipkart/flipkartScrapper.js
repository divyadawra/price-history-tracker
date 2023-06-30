const cheerio = require('cheerio');
const axios = require('axios'); 


const scrapeUrl = async (url) => {
  return await axios.get(url).then(async (response) => { 
        const body = response.data; 
        const $ = cheerio.load(body); // Load HTML data and initialize cheerio 
       return await getProductDetails($) 
    });
} 

const getProductDetails = async ($) => {

    let title = $('.B_NuCI').text();
    let price = $('._16Jk6d').text();
    let ratingArray = $('._1lRcqv');
    let rating = '';
    if (ratingArray.length > 0) {
        rating = $(ratingArray[0]).text();
    } else {
        rating = $('._1lRcqv').text();
    }  
    let ratingCountArray = $('._2_R_DZ');
    let ratingCount = '';
    if (ratingCountArray.length > 0) {
        ratingCount = $(ratingCountArray[0]).text();
    } else {
        ratingCount = $('._2_R_DZ').text();
    } 

    let inStock = 'Available';
    let priceFetchedAt = (new Date()).toLocaleString();
    return {name: title, price: price, rating:rating , ratingCount: ratingCount, inStock: inStock, priceFetchedAt: priceFetchedAt};
}

module.exports = scrapeUrl;

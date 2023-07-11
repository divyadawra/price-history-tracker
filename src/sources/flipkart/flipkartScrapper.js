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
    let data = {name: title, price: price, rating:rating , ratingCount: ratingCount, inStock: inStock};
    return await sanitizeScrapedData(data);
}

const sanitizeScrapedData = async function(data) {
    data.name = data.name.trim();
    if(data.price) {
       data.price = data.price.replace(/[,\u20b9]/g, "");
       console.log(data.price);
       data.price = parseFloat(data.price).toFixed(2);
       console.log(data.price);
    }
    data.inStock = data.inStock ? data.inStock.trim(): null;
    return data;
}
module.exports = scrapeUrl;

var osmosis = require('osmosis');
import {Amazon} from './amazon.entity';

const scrape = async (url) => {
    var scrappedProduct = new Amazon();
 
    scrappedProduct.url = url;

    console.log('init');
    osmosis.get(url)
    .find('div#titleSection')
    .set('name', 'span#productTitle')
    .find('div#corePriceDisplay_desktop_feature_div')
    .set({'price': 'span.a-offscreen'})
    .find('div#averageCustomerReviews')
    .set({'ratingCount': 'span#acrCustomerReviewText',
        'rating': 'span.reviewCountTextLinkedHistogram'})
    .find('div#availabilityInsideBuyBox_feature_div')
    .set({
        'inStock':'div#availability'
    })
    .data(function(result) {

        for (const key in result) {
            if (scrappedProduct.hasOwnProperty(key)) {
              console.log(`${key}: ${result[key]}`);
            }
          }
        console.log(result);
        // result.
        scrappedProduct.name = result.name;

        // AmazonService.saveProduct()

    }).done(

    );
}

// https://www.amazon.in/AYSIS-Double-Crawling-Resistant-Biggest/dp/B08KF591QD
// https://www.amazon.in/Redmi-Sea-Green-32GB-Storage/dp/B0C46H59YD
// https://www.amazon.in/Pikify-Standing-Bathroom-Cosmetic-Organizer/dp/B0C14DRW53
// https://www.amazon.in/Stylum-Womens-Kantha-Cotton-Purple/dp/B0BTYSNF76
// https://www.amazon.in/dp/B07PFFMP9P

scrape('https://www.amazon.in/Pikify-Standing-Bathroom-Cosmetic-Organizer/dp/B0C14DRW53')
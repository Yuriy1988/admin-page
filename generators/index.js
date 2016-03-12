/**
 * Created by gasya on 11.03.16.
 */
console.log("#XOPay demo generator");

const configs = require("./config");
const Requester = require('./lib/requester');


const requester = new Requester(configs);


const endpoints = require("./endpoints");


const generateMerchant = require("./data/merchants");

const generateStore = require("./data/store");

for (var i = 0; i < 25; i++) {
    requester.makeRequest(endpoints.CREATE_MERCHANT, generateMerchant());
}

for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 20; j++) {
        requester.makeRequest(endpoints.CREATE_MERCHANT_STORE(i), generateStore());
    }
}


//requester.makeRequest(endpoints.CREATE_MERCHANT, generateMerchant());






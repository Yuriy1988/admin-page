/**
 * Created by gasya on 11.03.16.
 * DigitalOutlooks corporation.
 */

const chooser = require("../../lib/chooser");
const randomInt = require("../../lib/random").randomInt;
const randomBool = require("../../lib/random").randomBool;
const randomFloat = require("../../lib/random").randomFloat;

const storeNames = require("./storeNames.json");
const signAlgorithms = require("./signAlgorithms.json");

const loremIpsum = require('lorem-ipsum');


const generate = () => {
    const storeName = chooser(storeNames);
    const storeDomain = storeName.replace(/\s/g, "-").toLowerCase().replace(/[^a-z|\-]/g,"");
    const storeUrl = "http://www." + storeDomain + "." + chooser(["com", "ua", "org", "ru", "com.ua", "net"]);
    return {
        "store_name": storeName,
        "store_identifier": randomInt(1000000000000, 9999999999999).toString(),
        "store_url": storeUrl,
        "description": loremIpsum({count: 3}),
        "logo": storeUrl + "/logo.jpg",
        "show_logo": randomBool(),
        "store_settings": {
            "sign_algorithm": chooser(signAlgorithms),
            "sign_key": randomInt(1000000000000, 9999999999999).toString(),
            "succeed_url": storeUrl + "/success",
            "failure_url": storeUrl + "/fail",
            "commission_pct": randomFloat(0.5, 4).toFixed(2)
        }
    }
};


module.exports = generate;
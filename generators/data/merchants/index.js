/**
 * Created by gasya on 11.03.16.
 * DigitalOutlooks corporation.
 */

const chooser = require("../../lib/chooser");

const merchantNames = require("./merchantNames.json");
const bankNames = require("./bankNames.json");
const currencies = require("./currencies.json");
const generateUser = require("../user");
const generateCard = require("../cards");
const generateName = require("../user").generateName;


const generate = () => {
    return {
        "merchant_name": chooser(merchantNames),
        "merchant_account": {
            "bank_name": chooser(bankNames),
            "checking_account": generateCard.card(),
            "currency": chooser(currencies),
            "mfo": generateCard.mfo(),
            "okpo": generateCard.okpo()
        },
        "merchant_info": {
            "address": "Ukraine Dnipropetrovsk",
            "director_name": generateName()
        },
        "user": generateUser()
    };
};


module.exports = generate;
/**
 * Created by gasya on 11.03.16.
 * DigitalOutlooks corporation.
 */

const randomInt = require("../../lib/random").randomInt;

const generate = {};

generate.card = () => {
    var card = [];
    for (var i = 0; i < 4; i++) {
        card.push(randomInt(1000, 9999).toString());
    }
    return card.join("");
};

generate.mfo = () => {
    return randomInt(100000, 999999).toString();
};

generate.okpo = () => {
    return randomInt(10000000, 99999999).toString();
};

module.exports = generate;
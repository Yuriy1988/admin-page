/**
 * Created by gasya on 11.03.16.
 * DigitalOutlooks corporation.
 */

const choose = require("../../lib/chooser");
const randomInt = require("../../lib/random").randomInt;


const generate = () => {
    const country = "380";
    const opCode = choose(["6", "9"]) + choose(["3", "6", "7", "8", "9"]);
    const phone = randomInt(1000000, 9999999).toString();
    return country + opCode + phone;
};

module.exports = generate;
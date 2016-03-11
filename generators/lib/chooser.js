/**
 * Created by gasya on 11.03.16.
 * DigitalOutlooks corporation.
 */
const randomInt = require('./random').randomInt;

const chooser = (arr) => {
    return arr[randomInt(0, arr.length - 1)];
};

module.exports = chooser;
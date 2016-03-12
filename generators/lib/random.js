/**
 * Created by gasya on 11.03.16.
 * DigitalOutlooks corporation.
 */

const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomFloat = (min, max) => {
    return (Math.random() * (max - min)) + min;
};

const randomBool = () => {
    return !!(Math.floor(Math.random() * 2));
};



module.exports = {
    randomInt,
    randomFloat,
    randomBool
};
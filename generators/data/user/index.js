/**
 * Created by gasya on 11.03.16.
 * DigitalOutlooks corporation.
 */

const chooser = require("../../lib/chooser");

const userFNames = require("./userFNames.json");
const userLNames = require("./userLNames.json");
const notify = require("./notify.json");
const generatePhone = require("../phones/index");



const generate = () => {
    const fName = chooser(userFNames);
    const lName = chooser(userLNames);

    return {
        "username": (fName + "." + lName).toLowerCase(),
        "first_name": fName,
        "last_name": lName,
        "email": (fName + "." + lName).toLowerCase() + "@gmail.com",
        "phone": generatePhone(),
        "notify": chooser(notify),
        "enabled": chooser([true, false])
    }
};

generate.generateName = () => {
    const fName = chooser(userFNames);
    const lName = chooser(userLNames);
    return fName + " " + lName;
};

module.exports = generate;
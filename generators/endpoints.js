/**
 * Created by gasya on 12.03.16.
 * DigitalOutlooks corporation.
 */

const version = "dev";
const root = "/api/admin/" + version + "/";


const CREATE_MERCHANT = root + "merchants";
const CREATE_MERCHANT_STORE = (mid) => root + "merchants/" + mid + "/stores";

module.exports = {
    CREATE_MERCHANT,
    CREATE_MERCHANT_STORE
};
import { Schema, arrayOf, valuesOf} from 'normalizr'

/**
 * MERCHANTS
 */
const merchantSchema = new Schema('merchants');
const merchantListSchema = {merchants: arrayOf(merchantSchema)};
export const MERCHANT_LIST = {path: "merchants", method: "GET", schema: merchantListSchema};
export const MERCHANT_CREATE = {path: "merchants", method: "POST", schema: merchantSchema};
export const MERCHANT_GET = (merchantId) => ({path: `merchants/${merchantId}`, method: "GET", schema: merchantSchema});
export const MERCHANT_DELETE = (merchantId) => ({path: `merchants/${merchantId}`, method: "DELETE", schema: merchantSchema});


/**
 * STORES
 */
const storesSchema = new Schema('stores');
const storesListSchema = {stores: arrayOf(storesSchema)};
export const STORES_LIST = (merchantId) => ({path: `merchants/${merchantId}/stores`, method: "GET", schema: storesListSchema});
export const STORES_CREATE = (merchantId) => ({path: `merchants/${merchantId}/stores`, method: "POST", schema: storesSchema});
export const STORE_GET = (storeId) => ({path: `stores/${storeId}`, method: "GET", schema: storesSchema});


/**
 * DICTIONARY
 */

export const DICT_SIGN_ALGORITHM = {path: "constants/sign_algorithm", method: "GET" };
export const DICT_CURRENCY = {path: "constants/currency", method: "GET" };
export const DICT_NOTIFY = {path: "constants/notify", method: "GET" };
export const DICT_CATEGORY = {path: "constants/category", method: "GET" };
export const DICT_PAYSYS_ID = {path: "constants/paysys_id", method: "GET" };


/**
 * CURRENCY
 */
const currencySchema = new Schema('currency');
const currenciesSchema = {history: arrayOf(currencySchema)};
export const CURRENCY_HISTORY = {path: "currency/history", method: "GET", schema: currenciesSchema}; //?from_currency=USD&to_currency=UAH&from_date=2016-04-01&till_date=2016-04-08


/**
 * Sign algorithm
 * > GET /api/admin/{version}/constants/sign_algorithm
 * < 200 OK { sign_algorithm: [“MD5”, “SHA1”] }
 */
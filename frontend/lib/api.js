import { Schema, arrayOf, valuesOf} from 'normalizr'
let version = localStorage.apiVersion || 'dev';

/**
 * SYSTEM_ACTIONS
 */
export const SERVER_VERSION_GET = {path: "../version", method: "GET", isAuth: false};

/**
 * ANTIFRAUD
 */

export const ANTIFRAUD_GET = {path: "antifraud_settings/scoring_rules",  method: "GET"};
export const ANTIFRAUD_SETTINGS_GET = {path: "antifraud_settings/settings",  method: "GET"};
export const ANTIFRAUD_SETTINGS_SET = {path: "antifraud_settings/settings",  method: "PUT"};
export const ANTIFRAUD_PUT = (id) => ({path: `antifraud_settings/scoring_rules/${id}`,  method: "PUT"});



/**
 * USER_ACTIONS
 */
export const USER_LOGIN = {path: "authorization", method: "POST", isAuth: false};
export const USER_LOGOUT = {path: "authorization/token", method: "DELETE"};
export const USER_CREATE_PASS = (token) => ({path: `user/create_password?token=${token}`, method: "POST", isAuth: false});
export const USER_RECOVER_PASS = {path: 'user/forgot_password', method: "POST", isAuth: false};
export const USER_CHANGE_MERCHANT_PASS = (merchantId) => ({path: `users/${merchantId}/change_password`, method: "POST"});
export const USER_CHANGE_SELF_PASS  = {path: `user/change_password`, method: "POST"};
export const USER_GET_ADMIN_STAT = (query) =>({path: `statistics/payments?${query}`, method: "GET"});

/**
 * Statistic
 */
export const CHART_STAT_GET = (query, args) =>({path: `statistics/payments_count?by=${query}${args}`, method: "GET"});
///api/admin/{version}/statistics/payments_count?by=<status|paysys|currency|store>&<args>
/**
 * MERCHANTS
 */
const merchantSchema = new Schema('merchants');
const merchantListSchema = {merchants: arrayOf(merchantSchema)};
export const MERCHANT_LIST = {path: "merchants", method: "GET", schema: merchantListSchema};
export const MERCHANT_CREATE = {path: "merchants", method: "POST", schema: merchantSchema};
export const MERCHANT_GET = (merchantId) => ({path: `merchants/${merchantId}`, method: "GET", schema: merchantSchema});
export const MERCHANT_EDIT= (merchantId) => ({path: `merchants/${merchantId}`, method: "PUT", schema: merchantSchema});
export const MERCHANT_DELETE = (merchantId) => ({path: `merchants/${merchantId}`, method: "DELETE", schema: merchantSchema});

/**
 * PAYSYSTEMS
 */
const paySystemSchema = new Schema('paySystems');
const paySystemListSchema = {paymentSystems: arrayOf(paySystemSchema)};
export const PAYSYSTEMS_LIST = {path: "payment_systems", method: "GET", schema: paySystemListSchema};
export const PAYSYSTEM_GET = (paySysId) => ({path: `payment_systems/${paySysId}`, method: "GET", schema: paySystemSchema});
export const PAYSYSTEM_EDIT= (paySysId, data) => ({path: `payment_systems/${paySysId}`, method: "PUT", schema: paySystemSchema});

/**
 * STORES
 */
const storesSchema = new Schema('stores');
const storesListSchema = {stores: arrayOf(storesSchema)};
export const STORES_LIST = (merchantId) => ({path: `merchants/${merchantId}/stores`, method: "GET", schema: storesListSchema});
export const STORES_CREATE = (merchantId) => ({path: `merchants/${merchantId}/stores`, method: "POST", schema: storesSchema});
export const STORE_GET = (storeId) => ({path: `stores/${storeId}`, method: "GET", schema: storesSchema});
export const STORE_EDIT = (storeId) => ({path: `stores/${storeId}`, method: "PUT", schema: storesSchema});
export const STORE_DELETE = (storeId) => ({path: `stores/${storeId}`, method: "DELETE", schema: storesSchema});
export const STORE_GET_ALL = {path: `storenames`, method: "GET"};

/**
 * MERCHANT_CONTRACTS
 */
const merchantContractSchema = new Schema('merchantContracts');
const merchantContractListSchema = {contracts: arrayOf(merchantContractSchema)};
export const MERCHANT_CONTRACT_LIST = (merchantId) => ({path: `merchants/${merchantId}/contracts`, method: "GET", schema: merchantContractListSchema});
export const MERCHANT_CONTRACT_CREATE = (merchantId) => ({path: `merchants/${merchantId}/contracts`, method: "POST", schema: merchantContractSchema});
export const MERCHANT_CONTRACT_EDIT = (merchantContractId) => ({path: `merchant_contracts/${merchantContractId}`, method: "PUT", schema: merchantContractSchema});
export const MERCHANT_CONTRACT_GET = (merchantContractId) => ({path: `merchant_contracts/${merchantContractId}`, method: "GET", schema: merchantContractSchema});
export const MERCHANT_CONTRACT_DELETE = (merchantContractId) => ({path: `merchant_contracts/${merchantContractId}`, method: "DELETE", schema: merchantContractSchema});


/**
 * PAYSYSTEM_CONTRACTS
 */
const paysystemContractSchema = new Schema('paysysContracts');
const paysystemContractListSchema = {contracts: arrayOf(paysystemContractSchema)};
export const PAYSYSTEM_CONTRACT_LIST = (paysysId) => ({path: `payment_systems/${paysysId}/contracts`, method: "GET", schema: paysystemContractListSchema});
export const PAYSYSTEM_CONTRACT_CREATE = (paysysId) => ({path: `payment_systems/${paysysId}/contracts`, method: "POST", schema: paysystemContractSchema});
export const PAYSYSTEM_CONTRACT_EDIT = (paysysContractId) => ({path: `paysys_contracts/${paysysContractId}`, method: "PUT", schema: paysystemContractSchema});
export const PAYSYSTEM_CONTRACT_GET = (paysysContractId) => ({path: `paysys_contracts/${paysysContractId}`, method: "GET", schema: paysystemContractSchema});
export const PAYSYSTEM_CONTRACT_DELETE = (paysysContractId) => ({path: `paysys_contracts/${paysysContractId}`, method: "DELETE", schema: paysystemContractSchema});


/**
 * DICTIONARY
 */
export const DICT_SIGN_ALGORITHM = {path: "constants/sign_algorithm", method: "GET" };
export const DICT_CURRENCY = {path: "constants/currency", method: "GET"};
export const DICT_NOTIFY = {path: "constants/notify", method: "GET"};
export const DICT_CATEGORY = {path: "constants/category", method: "GET" };
export const DICT_PAYMENT_INTERFACES = {path: "constants/payment_interface", method: "GET"};
export const DICT_PAYSYS_ID = {path: "payment_systems/allowed/paysys_id", method: "GET" };


/**
 * CURRENCY
 */
const currencySchema = new Schema('currency');
const currenciesSchema = {history: arrayOf(currencySchema)};
export const CURRENCY_HISTORY = {path: "currency/history", method: "GET", schema: currenciesSchema}; //?from_currency=USD&to_currency=UAH&from_date=2016-04-01&till_date=2016-04-08


/**
 * Store payment systems
 */
const storePaySysSchema = new Schema('storePaySys');
const storePaySysSchemaList = {storePaysys: arrayOf(storePaySysSchema)};
export const STORE_PAYSYS_LIST = (storeId) => ({path: `stores/${storeId}/store_paysys`, method: "GET", schema: storePaySysSchemaList});
export const STORE_PAYSYS_UPDATE = (storePaysysId) => ({path: `store_paysys/${storePaysysId}`, method: "PUT", schema: storePaySysSchema});

/**
 * Notification
 */

export const NOTIFICATIONS_GET = {path: `../../../api/notify/${version}/notifications`, method: "GET"};
export const NOTIFICATION_GET_BY_ID =(id) => ({path: `../../../api/notify/${version}/notifications/${id}`, method: "GET"});
export const NOTIFICATION_EDIT = (id) => ({path: `../../../api/notify/${version}/notifications/${id}`, method: "PUT" });
export const NOTIFICATION_ADD = {path: `../../../api/notify/${version}/notifications`, method: "POST" };
export const NOTIFICATION_DELETE = (id) => ({path: `../../../api/notify/${version}/notifications/${id}`, method: "DELETE" });


/**
 * Sign algorithm
 * > GET /api/admin/{version}/constants/sign_algorithm
 * < 200 OK { sign_algorithm: [“MD5”, “SHA1”] }
 */
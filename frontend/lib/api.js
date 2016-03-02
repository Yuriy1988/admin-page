import { Schema, arrayOf } from 'normalizr'

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



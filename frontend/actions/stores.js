import { CALL_API } from '../middleware/api'


import {STORES_LIST} from '../lib/api'
export const STORES_LIST_REQUEST = 'STORES_LIST_REQUEST';
export const STORES_LIST_SUCCESS = 'STORES_LIST_SUCCESS';
export const STORES_LIST_FAILURE = 'STORES_LIST_FAILURE';
export const STORES_LIST_CERROR = 'STORES_LIST_CERROR';
export function getListCError() {
    return {
        type: STORES_LIST_CERROR
    }
}
export function getList(merchantId) {
    return {
        [CALL_API]: {
            types: [STORES_LIST_REQUEST, STORES_LIST_SUCCESS, STORES_LIST_FAILURE],
            cError: STORES_LIST_CERROR,
            endpoint: STORES_LIST(merchantId)
        }
    }
}

import {STORES_CREATE} from '../lib/api'
export const STORES_CREATE_REQUEST = 'STORES_CREATE_REQUEST';
export const STORES_CREATE_SUCCESS = 'STORES_CREATE_SUCCESS';
export const STORES_CREATE_FAILURE = 'STORES_CREATE_FAILURE';
export const STORES_CREATE_CERROR = 'STORES_CREATE_CERROR';
export function createCError() {
    return {
        type: STORES_CREATE_CERROR
    }
}
export function create(merchantId, store) {
    return {
        [CALL_API]: {
            types: [STORES_CREATE_REQUEST, STORES_CREATE_SUCCESS, STORES_CREATE_FAILURE],
            cError: STORES_CREATE_CERROR,
            endpoint: STORES_CREATE(merchantId),
            body: store
        }
    }
}

/*
import {MERCHANT_GET} from '../lib/api'
export const MERCHANT_GET_REQUEST = 'MERCHANT_GET_REQUEST';
export const MERCHANT_GET_SUCCESS = 'MERCHANT_GET_SUCCESS';
export const MERCHANT_GET_FAILURE = 'MERCHANT_GET_FAILURE';
export const MERCHANT_GET_CERROR = 'MERCHANT_GET_CERROR';
export function getByIdCError() {
    return {
        type: MERCHANT_GET_CERROR
    }
}
export function getById(merchantId) {
    return {
        [CALL_API]: {
            types: [MERCHANT_GET_REQUEST, MERCHANT_GET_SUCCESS, MERCHANT_GET_FAILURE],
            cError: MERCHANT_GET_CERROR,
            endpoint: MERCHANT_GET(merchantId)
        }
    }
}*/
import { CALL_API } from '../middleware/api'


import {MERCHANT_LIST} from '../lib/api'
export const MERCHANTS_LIST_REQUEST = 'MERCHANTS_LIST_REQUEST';
export const MERCHANTS_LIST_SUCCESS = 'MERCHANTS_LIST_SUCCESS';
export const MERCHANTS_LIST_FAILURE = 'MERCHANTS_LIST_FAILURE';
export const MERCHANTS_LIST_CERROR = 'MERCHANTS_LIST_CERROR';
export function getListCError() {
    return {
        type: MERCHANTS_LIST_CERROR
    }
}
export function getList() {
    return {
        [CALL_API]: {
            types: [MERCHANTS_LIST_REQUEST, MERCHANTS_LIST_SUCCESS, MERCHANTS_LIST_FAILURE],
            cError: MERCHANTS_LIST_CERROR,
            endpoint: MERCHANT_LIST
        }
    }
}

import {MERCHANT_CREATE} from '../lib/api'
export const MERCHANT_CREATE_REQUEST = 'MERCHANT_CREATE_REQUEST';
export const MERCHANT_CREATE_SUCCESS = 'MERCHANT_CREATE_SUCCESS';
export const MERCHANT_CREATE_FAILURE = 'MERCHANT_CREATE_FAILURE';
export const MERCHANT_CREATE_CERROR = 'MERCHANT_CREATE_CERROR';
export function createCError() {
    return {
        type: MERCHANT_CREATE_CERROR
    }
}
export function create(merchant) {
    return {
        [CALL_API]: {
            types: [MERCHANT_CREATE_REQUEST, MERCHANT_CREATE_SUCCESS, MERCHANT_CREATE_FAILURE],
            cError: MERCHANT_CREATE_CERROR,
            endpoint: MERCHANT_CREATE,
            body: merchant
        }
    }
}


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
}


import {MERCHANT_DELETE} from '../lib/api'
export const MERCHANT_DELETE_REQUEST = 'MERCHANT_DELETE_REQUEST';
export const MERCHANT_DELETE_SUCCESS = 'MERCHANT_DELETE_SUCCESS';
export const MERCHANT_DELETE_FAILURE = 'MERCHANT_DELETE_FAILURE';
export const MERCHANT_DELETE_CERROR = 'MERCHANT_DELETE_CERROR';
export function deleteByIdCError() {
    return {
        type: MERCHANT_DELETE_CERROR
    }
}
export function deleteById(merchantId) {
    return {
        [CALL_API]: {
            types: [MERCHANT_DELETE_REQUEST, {
                type: MERCHANT_DELETE_SUCCESS,
                deleteObject: {
                    entity: "merchants",
                    id: merchantId
                }
            }, MERCHANT_DELETE_FAILURE],
            cError: MERCHANT_DELETE_CERROR,
            endpoint: MERCHANT_DELETE(merchantId)
        }
    }
}


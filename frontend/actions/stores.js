import { CALL_API } from '../middleware/api'

/**
 * List of stores
 */
import { STORES_LIST } from '../lib/api'
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

/**
 * Creating store
 */
import { STORES_CREATE } from '../lib/api'
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

/**
 * Getting store
 */
import { STORE_GET } from '../lib/api'
export const STORE_GET_REQUEST = 'STORE_GET_REQUEST';
export const STORE_GET_SUCCESS = 'STORE_GET_SUCCESS';
export const STORE_GET_FAILURE = 'STORE_GET_FAILURE';
export const STORE_GET_CERROR = 'STORE_GET_CERROR';
export function getByIdCError() {
    return {
        type: STORE_GET_CERROR
    }
}
export function getById(storeId) {
    return {
        [CALL_API]: {
            types: [STORE_GET_REQUEST, STORE_GET_SUCCESS, STORE_GET_FAILURE],
            cError: STORE_GET_CERROR,
            endpoint: STORE_GET(storeId)
        }
    }
}
export function getByIdLazy(storeId) {
    return (dispatch, getState) => {
        if (!getState().entities.stores[storeId]) {
            return dispatch(getById(storeId))
        }
    }
}


/**
 * Updating store
 */
import { STORE_EDIT } from '../lib/api'
export const STORE_EDIT_REQUEST = 'STORE_EDIT_REQUEST';
export const STORE_EDIT_SUCCESS = 'STORE_EDIT_SUCCESS';
export const STORE_EDIT_FAILURE = 'STORE_EDIT_FAILURE';
export const STORE_EDIT_CERROR = 'STORE_EDIT_CERROR';
export function editByIdCError() {
    return {
        type: STORE_GET_CERROR
    }
}
export function editById(storeId, store) {
    return {
        [CALL_API]: {
            types: [STORE_EDIT_REQUEST, STORE_EDIT_SUCCESS, STORE_EDIT_FAILURE],
            cError: STORE_EDIT_CERROR,
            endpoint: STORE_EDIT(storeId),
            body: store
        }
    }
}


/**
 * Deleting store
 */
import { STORE_DELETE } from '../lib/api'
export const STORE_DELETE_REQUEST = 'STORE_DELETE_REQUEST';
export const STORE_DELETE_SUCCESS = 'STORE_DELETE_SUCCESS';
export const STORE_DELETE_FAILURE = 'STORE_DELETE_FAILURE';
export const STORE_DELETE_CERROR = 'STORE_DELETE_CERROR';
export function deleteByIdCError() {
    return {
        type: STORE_DELETE_CERROR
    }
}
export function deleteById(storeId) {
    return {
        [CALL_API]: {
            types: [STORE_DELETE_REQUEST, {
                type: STORE_DELETE_SUCCESS,
                deleteObject: {
                    entity: "stores",
                    id: storeId
                }
            }, STORE_DELETE_FAILURE],
            cError: STORE_DELETE_CERROR,
            endpoint: STORE_DELETE(storeId)
        }
    }
}


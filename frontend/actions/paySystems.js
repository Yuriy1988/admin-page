import {CALL_API} from '../middleware/api'

/**
 * List of payment systems
 */
import {PAYSYSTEMS_LIST} from '../lib/api'
export const PAYSYSTEMS_LIST_REQUEST = 'PAYSYSTEMS_LIST_REQUEST';
export const PAYSYSTEMS_LIST_SUCCESS = 'PAYSYSTEMS_LIST_SUCCESS';
export const PAYSYSTEMS_LIST_FAILURE = 'PAYSYSTEMS_LIST_FAILURE';
export const PAYSYSTEMS_LIST_CERROR = 'PAYSYSTEMS_LIST_CERROR';
export function getListCError() {
    return {
        type: PAYSYSTEMS_LIST_CERROR
    }
}
export function getList() {
    return {
        [CALL_API]: {
            types: [PAYSYSTEMS_LIST_REQUEST, PAYSYSTEMS_LIST_SUCCESS, PAYSYSTEMS_LIST_FAILURE],
            cError: PAYSYSTEMS_LIST_CERROR,
            endpoint: PAYSYSTEMS_LIST
        }
    }
}


/**
 * Getting store
 */
import {PAYSYSTEM_GET} from '../lib/api'
export const PAYSYSTEM_GET_REQUEST = 'PAYSYSTEM_GET_REQUEST';
export const PAYSYSTEM_GET_SUCCESS = 'PAYSYSTEM_GET_SUCCESS';
export const PAYSYSTEM_GET_FAILURE = 'PAYSYSTEM_GET_FAILURE';
export const PAYSYSTEM_GET_CERROR = 'PAYSYSTEM_GET_CERROR';
export function getByIdCError() {
    return {
        type: PAYSYSTEM_GET_CERROR
    }
}
export function getById(paySysId) {
    return {
        [CALL_API]: {
            types: [PAYSYSTEM_GET_REQUEST, PAYSYSTEM_GET_SUCCESS, PAYSYSTEM_GET_FAILURE],
            cError: PAYSYSTEM_GET_CERROR,
            endpoint: PAYSYSTEM_GET(paySysId)
        }
    }
}
export function getByIdLazy(paySysId) {
    return (dispatch, getState) => {
        if (!getState().entities.paySystems[paySysId]) {
            return dispatch(getById(paySysId))
        }
    }
}


/**
 * Updating store
 */
import {PAYSYSTEM_EDIT} from '../lib/api'
export const PAYSYSTEM_EDIT_REQUEST = 'PAYSYSTEM_EDIT_REQUEST';
export const PAYSYSTEM_EDIT_SUCCESS = 'PAYSYSTEM_EDIT_SUCCESS';
export const PAYSYSTEM_EDIT_FAILURE = 'PAYSYSTEM_EDIT_FAILURE';
export const PAYSYSTEM_EDIT_CERROR = 'PAYSYSTEM_EDIT_CERROR';
export function editByIdCError() {
    return {
        type: PAYSYSTEM_GET_CERROR
    }
}
export function editById(paySysId, data) {
    return {
        [CALL_API]: {
            types: [PAYSYSTEM_EDIT_REQUEST, PAYSYSTEM_EDIT_SUCCESS, PAYSYSTEM_EDIT_FAILURE],
            cError: PAYSYSTEM_EDIT_CERROR,
            endpoint: PAYSYSTEM_EDIT(paySysId),
            body: data
        }
    }
}

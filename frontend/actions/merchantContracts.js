import { CALL_API } from '../middleware/api'

/**
 * List of merchant contracts
 */
import { MERCHANT_CONTRACT_LIST } from '../lib/api'
export const MERCHANT_CONTRACT_LIST_REQUEST = 'MERCHANT_CONTRACT_LIST_REQUEST';
export const MERCHANT_CONTRACT_LIST_SUCCESS = 'MERCHANT_CONTRACT_LIST_SUCCESS';
export const MERCHANT_CONTRACT_LIST_FAILURE = 'MERCHANT_CONTRACT_LIST_FAILURE';
export const MERCHANT_CONTRACT_LIST_CERROR = 'MERCHANT_CONTRACT_LIST_CERROR';
export function getListCError() {
    return {
        type: MERCHANT_CONTRACT_LIST_CERROR
    }
}
export function getList(merchantId, filters = {}) {//TODO filters currency=USD&active=true
    return {
        [CALL_API]: {
            types: [MERCHANT_CONTRACT_LIST_REQUEST, MERCHANT_CONTRACT_LIST_SUCCESS, MERCHANT_CONTRACT_LIST_FAILURE],
            cError: MERCHANT_CONTRACT_LIST_CERROR,
            endpoint: MERCHANT_CONTRACT_LIST(merchantId)
        }
    }
}


/*
 * Get merchant contracts
 */
import { MERCHANT_CONTRACT_GET } from '../lib/api'
export const MERCHANT_CONTRACT_GET_REQUEST = 'MERCHANT_CONTRACT_GET_REQUEST';
export const MERCHANT_CONTRACT_GET_SUCCESS = 'MERCHANT_CONTRACT_GET_SUCCESS';
export const MERCHANT_CONTRACT_GET_FAILURE = 'MERCHANT_CONTRACT_GET_FAILURE';
export const MERCHANT_CONTRACT_GET_CERROR = 'MERCHANT_CONTRACT_GET_CERROR';
export function getByIdCError() {
    return {
        type: MERCHANT_CONTRACT_GET_CERROR
    }
}
export function getById(merchantContractId) {
    return {
        [CALL_API]: {
            types: [MERCHANT_CONTRACT_GET_REQUEST, MERCHANT_CONTRACT_GET_SUCCESS, MERCHANT_CONTRACT_GET_FAILURE],
            cError: MERCHANT_CONTRACT_GET_CERROR,
            endpoint: MERCHANT_CONTRACT_GET(merchantContractId)
        }
    }
}
export function getByIdLazy(merchantContractId) {
    return (dispatch, getState) => {
        if (!getState().entities.merchantContracts[merchantContractId]) {
            return dispatch(getById(merchantContractId))
        }
    }
}


/**
 * Deleting merchant contract
 */
import { MERCHANT_CONTRACT_DELETE } from '../lib/api'
export const MERCHANT_CONTRACT_DELETE_REQUEST = 'MERCHANT_CONTRACT_DELETE_REQUEST';
export const MERCHANT_CONTRACT_DELETE_SUCCESS = 'MERCHANT_CONTRACT_DELETE_SUCCESS';
export const MERCHANT_CONTRACT_DELETE_FAILURE = 'MERCHANT_CONTRACT_DELETE_FAILURE';
export const MERCHANT_CONTRACT_DELETE_CERROR = 'MERCHANT_CONTRACT_DELETE_CERROR';
export function deleteByIdCError() {
    return {
        type: MERCHANT_CONTRACT_DELETE_CERROR
    }
}
export function deleteById(merchantContractId) {
    return {
        [CALL_API]: {
            types: [MERCHANT_CONTRACT_DELETE_REQUEST, {
                type: MERCHANT_CONTRACT_DELETE_SUCCESS,
                deleteObject: {
                    entity: "merchantContracts",
                    id: merchantContractId
                }
            }, MERCHANT_CONTRACT_DELETE_FAILURE],
            cError: MERCHANT_CONTRACT_DELETE_CERROR,
            endpoint: MERCHANT_CONTRACT_DELETE(merchantContractId)
        }
    }
}

/**
 * Updating merchant contract
 */
import { MERCHANT_CONTRACT_EDIT } from '../lib/api'
export const MERCHANT_CONTRACT_EDIT_REQUEST = 'MERCHANT_CONTRACT_EDIT_REQUEST';
export const MERCHANT_CONTRACT_EDIT_SUCCESS = 'MERCHANT_CONTRACT_EDIT_SUCCESS';
export const MERCHANT_CONTRACT_EDIT_FAILURE = 'MERCHANT_CONTRACT_EDIT_FAILURE';
export const MERCHANT_CONTRACT_EDIT_CERROR = 'MERCHANT_CONTRACT_EDIT_CERROR';
export function editByIdCError() {
    return {
        type: MERCHANT_CONTRACT_EDIT_CERROR
    }
}
export function editById(merchantContractId, contract) {
    return {
        [CALL_API]: {
            types: [MERCHANT_CONTRACT_EDIT_REQUEST, MERCHANT_CONTRACT_EDIT_SUCCESS, MERCHANT_CONTRACT_EDIT_FAILURE],
            cError: MERCHANT_CONTRACT_EDIT_CERROR,
            endpoint: MERCHANT_CONTRACT_EDIT(merchantContractId),
            body: contract
        }
    }
}


/**
 * Creating merchant contract
 */
import { MERCHANT_CONTRACT_CREATE } from '../lib/api'
export const MERCHANT_CONTRACT_CREATE_REQUEST = 'MERCHANT_CONTRACT_CREATE_REQUEST';
export const MERCHANT_CONTRACT_CREATE_SUCCESS = 'MERCHANT_CONTRACT_CREATE_SUCCESS';
export const MERCHANT_CONTRACT_CREATE_FAILURE = 'MERCHANT_CONTRACT_CREATE_FAILURE';
export const MERCHANT_CONTRACT_CREATE_CERROR = 'MERCHANT_CONTRACT_CREATE_CERROR';
export function createCError() {
    return {
        type: MERCHANT_CONTRACT_CREATE_CERROR
    }
}
export function create(merchantId, contract) {
    return {
        [CALL_API]: {
            types: [MERCHANT_CONTRACT_CREATE_REQUEST, MERCHANT_CONTRACT_CREATE_SUCCESS, MERCHANT_CONTRACT_CREATE_FAILURE],
            cError: MERCHANT_CONTRACT_CREATE_CERROR,
            endpoint: MERCHANT_CONTRACT_CREATE(merchantId),
            body: contract
        }
    }
}


////CUSTOM ACTIONS

export function disable(merchantContractId) {
    return editById(merchantContractId, {active: false});
}

export function enable(merchantContractId) {
    return editById(merchantContractId, {active: true});
}


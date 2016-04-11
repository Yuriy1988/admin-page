import {CALL_API} from '../middleware/api'

/**
 * List of paysystem contracts
 */
import {PAYSYSTEM_CONTRACT_LIST} from '../lib/api'
export const PAYSYSTEM_CONTRACT_LIST_REQUEST = 'PAYSYSTEM_CONTRACT_LIST_REQUEST';
export const PAYSYSTEM_CONTRACT_LIST_SUCCESS = 'PAYSYSTEM_CONTRACT_LIST_SUCCESS';
export const PAYSYSTEM_CONTRACT_LIST_FAILURE = 'PAYSYSTEM_CONTRACT_LIST_FAILURE';
export const PAYSYSTEM_CONTRACT_LIST_CERROR = 'PAYSYSTEM_CONTRACT_LIST_CERROR';
export function getListCError() {
    return {
        type: PAYSYSTEM_CONTRACT_LIST_CERROR
    }
}
export function getList(paysystemId, filters = {}) {//TODO filters ?currency=USD&active=true
    return {
        [CALL_API]: {
            types: [PAYSYSTEM_CONTRACT_LIST_REQUEST, PAYSYSTEM_CONTRACT_LIST_SUCCESS, PAYSYSTEM_CONTRACT_LIST_FAILURE],
            cError: PAYSYSTEM_CONTRACT_LIST_CERROR,
            endpoint: PAYSYSTEM_CONTRACT_LIST(paysystemId)
        }
    }
}


/*
 * Get paysystem contracts
 */
import {PAYSYSTEM_CONTRACT_GET} from '../lib/api'
export const PAYSYSTEM_CONTRACT_GET_REQUEST = 'PAYSYSTEM_CONTRACT_GET_REQUEST';
export const PAYSYSTEM_CONTRACT_GET_SUCCESS = 'PAYSYSTEM_CONTRACT_GET_SUCCESS';
export const PAYSYSTEM_CONTRACT_GET_FAILURE = 'PAYSYSTEM_CONTRACT_GET_FAILURE';
export const PAYSYSTEM_CONTRACT_GET_CERROR = 'PAYSYSTEM_CONTRACT_GET_CERROR';
export function getByIdCError() {
    return {
        type: PAYSYSTEM_CONTRACT_GET_CERROR
    }
}
export function getById(paysystemContractId) {
    return {
        [CALL_API]: {
            types: [PAYSYSTEM_CONTRACT_GET_REQUEST, PAYSYSTEM_CONTRACT_GET_SUCCESS, PAYSYSTEM_CONTRACT_GET_FAILURE],
            cError: PAYSYSTEM_CONTRACT_GET_CERROR,
            endpoint: PAYSYSTEM_CONTRACT_GET(paysystemContractId)
        }
    }
}
export function getByIdLazy(paysystemContractId) {
    return (dispatch, getState) => {
        if (!getState().entities.paysystemContracts[paysystemContractId]) {
            return dispatch(getById(paysystemContractId))
        }
    }
}


/**
 * Deleting paysystem contract
 */
import {PAYSYSTEM_CONTRACT_DELETE} from '../lib/api'
export const PAYSYSTEM_CONTRACT_DELETE_REQUEST = 'PAYSYSTEM_CONTRACT_DELETE_REQUEST';
export const PAYSYSTEM_CONTRACT_DELETE_SUCCESS = 'PAYSYSTEM_CONTRACT_DELETE_SUCCESS';
export const PAYSYSTEM_CONTRACT_DELETE_FAILURE = 'PAYSYSTEM_CONTRACT_DELETE_FAILURE';
export const PAYSYSTEM_CONTRACT_DELETE_CERROR = 'PAYSYSTEM_CONTRACT_DELETE_CERROR';
export function deleteByIdCError() {
    return {
        type: PAYSYSTEM_CONTRACT_DELETE_CERROR
    }
}
export function deleteById(paysystemContractId) {
    return {
        [CALL_API]: {
            types: [PAYSYSTEM_CONTRACT_DELETE_REQUEST, {
                type: PAYSYSTEM_CONTRACT_DELETE_SUCCESS,
                deleteObject: {
                    entity: "paysystemContracts",
                    id: paysystemContractId
                }
            }, PAYSYSTEM_CONTRACT_DELETE_FAILURE],
            cError: PAYSYSTEM_CONTRACT_DELETE_CERROR,
            endpoint: PAYSYSTEM_CONTRACT_DELETE(paysystemContractId)
        }
    }
}

/**
 * Updating paysystem contract
 */
import {PAYSYSTEM_CONTRACT_EDIT} from '../lib/api'
export const PAYSYSTEM_CONTRACT_EDIT_REQUEST = 'PAYSYSTEM_CONTRACT_EDIT_REQUEST';
export const PAYSYSTEM_CONTRACT_EDIT_SUCCESS = 'PAYSYSTEM_CONTRACT_EDIT_SUCCESS';
export const PAYSYSTEM_CONTRACT_EDIT_FAILURE = 'PAYSYSTEM_CONTRACT_EDIT_FAILURE';
export const PAYSYSTEM_CONTRACT_EDIT_CERROR = 'PAYSYSTEM_CONTRACT_EDIT_CERROR';
export function editByIdCError() {
    return {
        type: PAYSYSTEM_CONTRACT_EDIT_CERROR
    }
}
export function editById(paysystemContractId, contract) {
    return {
        [CALL_API]: {
            types: [PAYSYSTEM_CONTRACT_EDIT_REQUEST, PAYSYSTEM_CONTRACT_EDIT_SUCCESS, PAYSYSTEM_CONTRACT_EDIT_FAILURE],
            cError: PAYSYSTEM_CONTRACT_EDIT_CERROR,
            endpoint: PAYSYSTEM_CONTRACT_EDIT(paysystemContractId),
            body: contract
        }
    }
}


/**
 * Creating paysystem contract
 */
import {PAYSYSTEM_CONTRACT_CREATE} from '../lib/api'
export const PAYSYSTEM_CONTRACT_CREATE_REQUEST = 'PAYSYSTEM_CONTRACT_CREATE_REQUEST';
export const PAYSYSTEM_CONTRACT_CREATE_SUCCESS = 'PAYSYSTEM_CONTRACT_CREATE_SUCCESS';
export const PAYSYSTEM_CONTRACT_CREATE_FAILURE = 'PAYSYSTEM_CONTRACT_CREATE_FAILURE';
export const PAYSYSTEM_CONTRACT_CREATE_CERROR = 'PAYSYSTEM_CONTRACT_CREATE_CERROR';
export function createCError() {
    return {
        type: PAYSYSTEM_CONTRACT_CREATE_CERROR
    }
}
export function create(paysystemId, contract) {
    return {
        [CALL_API]: {
            types: [PAYSYSTEM_CONTRACT_CREATE_REQUEST, PAYSYSTEM_CONTRACT_CREATE_SUCCESS, PAYSYSTEM_CONTRACT_CREATE_FAILURE],
            cError: PAYSYSTEM_CONTRACT_CREATE_CERROR,
            endpoint: PAYSYSTEM_CONTRACT_CREATE(paysystemId),
            body: contract
        }
    }
}


////CUSTOM ACTIONS

export function disable(paysystemContractId) {
    return editById(paysystemContractId, {active: false});
}

export function enable(paysystemContractId) {
    return editById(paysystemContractId, {active: true});
}


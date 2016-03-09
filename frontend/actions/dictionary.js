import { CALL_API } from '../middleware/api'



export const DICT_UPDATE_REQUEST = 'DICT_UPDATE_REQUEST';
export const DICT_UPDATE_SUCCESS = 'DICT_UPDATE_SUCCESS';
export const DICT_UPDATE_FAILURE = 'DICT_UPDATE_FAILURE';



import {DICT_SIGN_ALGORITHM, DICT_CATEGORY, DICT_CURRENCY, DICT_NOTIFY, DICT_PAYSYS_ID} from '../lib/api'

function fetchSignAlgorithm() {
    return {
        [CALL_API]: {
            types: [DICT_UPDATE_REQUEST, DICT_UPDATE_SUCCESS, DICT_UPDATE_FAILURE],
            endpoint: DICT_SIGN_ALGORITHM
        }
    }
}
function fetchCategories() {
    return {
        [CALL_API]: {
            types: [DICT_UPDATE_REQUEST, DICT_UPDATE_SUCCESS, DICT_UPDATE_FAILURE],
            endpoint: DICT_CATEGORY
        }
    }
}

function fetchCurrencies() {
    return {
        [CALL_API]: {
            types: [DICT_UPDATE_REQUEST, DICT_UPDATE_SUCCESS, DICT_UPDATE_FAILURE],
            endpoint: DICT_CURRENCY
        }
    }
}

function fetchNotifications() {
    return {
        [CALL_API]: {
            types: [DICT_UPDATE_REQUEST, DICT_UPDATE_SUCCESS, DICT_UPDATE_FAILURE],
            endpoint: DICT_NOTIFY
        }
    }
}

function fetchPaysysId() {
    return {
        [CALL_API]: {
            types: [DICT_UPDATE_REQUEST, DICT_UPDATE_SUCCESS, DICT_UPDATE_FAILURE],
            endpoint: DICT_PAYSYS_ID
        }
    }
}


export function loadSignAlgorithm() {
    return (dispatch, getState) => {
        if (!getState().dictionary.signAlgorithm || getState().dictionary.signAlgorithm.length == 0) {
            return dispatch(fetchSignAlgorithm())
        }
    }
}


export function loadCategories() {
    return (dispatch, getState) => {
        if (!getState().dictionary.category || getState().dictionary.category.length == 0) {
            return dispatch(fetchCategories())
        }
    }
}


export function loadCurrencies() {
    return (dispatch, getState) => {
        if (!getState().dictionary.currency || getState().dictionary.currency.length == 0) {
            return dispatch(fetchCurrencies())
        }
    }
}


export function loadNotifications() {
    return (dispatch, getState) => {
        if (!getState().dictionary.notify || getState().dictionary.notify.length == 0) {
            return dispatch(fetchNotifications())
        }
    }
}


export function loadPaysysId() {
    return (dispatch, getState) => {
        if (!getState().dictionary.paysysId || getState().dictionary.paysysId.length == 0) {
            return dispatch(fetchPaysysId())
        }
    }
}

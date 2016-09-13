import {CALL_API} from '../middleware/api';
import {MANAGERLIST_GET} from '../lib/api'
import {MANAGER_DELETE} from '../lib/api'
import {MANAGER_GET_BY_ID} from '../lib/api'
import {MANAGER_ADD} from '../lib/api'
import {MANAGER_EDIT} from '../lib/api'


export const MANAGERLIST_GET_REQUEST = 'MANAGERLIST_GET_REQUEST';
export const MANAGERLIST_GET_SUCCESS = 'MANAGERLIST_GET_SUCCESS';
export const MANAGERLIST_GET_FAILURE = 'MANAGERLIST_GET_FAILURE';
export const MANAGERLIST_GET_CERROR = 'MANAGERLIST_GET_CERROR';

export function managerListError() {
    return {
        type: MANAGERLIST_CERROR
    }
}

export function getManagerList(merchantId) {
    return {
        [CALL_API]: {
            types: [MANAGERLIST_GET_REQUEST, MANAGERLIST_GET_SUCCESS, MANAGERLIST_GET_FAILURE],
            cError: MANAGERLIST_GET_CERROR,
            endpoint: MANAGERLIST_GET(merchantId),
        }
    }
}

export const CLEAR_MANAGERLIST = 'CLEAR_MANAGERLIST';

export function clearManagerList() {
    return {
        type: CLEAR_MANAGERLIST
    }
}
export const MANAGER_GET_REQUEST = 'MANAGER_GET_REQUEST';
export const MANAGER_GET_SUCCESS = 'MANAGER_GET_SUCCESS';
export const MANAGER_GET_FAILURE = 'MANAGER_GET_FAILURE';
export const MANAGER_GET_CERROR = 'MANAGER_GET_CERROR';

export function getManagerById(id) {
    return {
        [CALL_API]: {
            types: [MANAGER_GET_REQUEST, MANAGER_GET_SUCCESS, MANAGER_GET_FAILURE],
            cError: MANAGER_GET_CERROR,
            endpoint: MANAGER_GET_BY_ID(id),
        }
    }
}

let path = location.pathname.split('/');
path.length = 6;
path = path.join('/');

export const MANAGER_DELETE_REQUEST = 'MANAGER_DELETE_REQUEST';
export const MANAGER_DELETE_SUCCESS = {redirectTo:path};
export const MANAGER_DELETE_FAILURE = 'MANAGER_DELETE_FAILURE';
export const MANAGER_DELETE_CERROR = 'MANAGER_DELETE_CERROR';

export function deleteManager(id) {
    return {
        [CALL_API]: {
            types: [MANAGER_DELETE_REQUEST, MANAGER_DELETE_SUCCESS, MANAGER_DELETE_FAILURE],
            cError: MANAGER_DELETE_CERROR,
            endpoint: MANAGER_DELETE(id),
        },
        id: id
    }
}

export const MANAGER_ADD_REQUEST = 'MANAGER_ADD_REQUEST';
export const MANAGER_ADD_SUCCESS = 'MANAGER_ADD_SUCCESS';

export const MANAGER_ADD_FAILURE = 'MANAGER_ADD_FAILURE';
export const MANAGER_ADD_CERROR = 'MANAGER_ADD_CERROR';

export function addManager(body, merchantId) {
    return {
        [CALL_API]: {
            types: [MANAGER_ADD_REQUEST, MANAGER_ADD_SUCCESS, MANAGER_ADD_FAILURE],
            cError: MANAGER_ADD_CERROR,
            endpoint: MANAGER_ADD(merchantId),
            body: {user:body}
        }
    }
}

export const MANAGER_EDIT_REQUEST = 'MANAGER_EDIT_REQUEST';
export const MANAGER_EDIT_SUCCESS = 'MANAGER_EDIT_SUCCESS';
export const MANAGER_EDIT_FAILURE = 'MANAGER_EDIT_FAILURE';
export const MANAGER_EDIT_CERROR = 'MANAGER_EDIT_CERROR';

export function editManager(body, managerId) {
    return {
        [CALL_API]: {
            types: [MANAGER_EDIT_REQUEST, MANAGER_EDIT_SUCCESS, MANAGER_EDIT_FAILURE],
            cError: MANAGER_EDIT_CERROR,
            endpoint: MANAGER_EDIT(managerId),
            body
        }
    }
}

export const MANAGER_CLEAR = 'MANAGER_CLEAR';
export function clearManager() {
    return {
        type: MANAGER_CLEAR
    }
}
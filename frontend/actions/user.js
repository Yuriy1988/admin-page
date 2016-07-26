import {CALL_API} from '../middleware/api';
import {USER_LOGIN} from '../lib/api'
import {USER_LOGOUT} from '../lib/api'
import {USER_CREATE_PASS} from '../lib/api'
import {USER_RECOVER_PASS} from '../lib/api'
import {USER_CHANGE_MERCHANT_PASS} from '../lib/api'

export const USER_LOGOUT_REQUEST = 'USER_LOGOUT_REQUEST';
export const USER_LOGOUT_SUCCESS = 'USER_LOGOUT_SUCCESS';
export const USER_LOGOUT_FAILURE = 'USER_LOGOUT_FAILURE';
export const USER_LOGOUT_CERROR = 'USER_LOGOUT_CERROR';


export function logout() {
    return {
        [CALL_API]: {
            types: [USER_LOGOUT_REQUEST, USER_LOGOUT_SUCCESS, USER_LOGOUT_FAILURE],
            cError: USER_LOGOUT_CERROR,
            endpoint: USER_LOGOUT,
        },
        redirectTo: "/admin"
    }
}

export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE';
export const USER_LOGIN_CERROR = 'USER_LOGIN_CERROR';

export function login_authError() {
    return {
        type: USER_LOGIN_CERROR
    }
}

export function login(username, password) {
    return {
        [CALL_API]: {
            types: [USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAILURE],
            cError: USER_LOGIN_CERROR,
            endpoint: USER_LOGIN,
            body: {username, password},
        },
        redirectTo: "/admin"
    }
}

export const USER_CREATE_PASS_REQUEST = 'USER_CREATE_PASS_REQUEST';
export const USER_CREATE_PASS_SUCCESS = 'USER_CREATE_PASS_SUCCESS';
export const USER_CREATE_PASS_FAILURE = 'USER_CREATE_PASS_FAILURE';
export const USER_CREATE_PASS_CERROR = 'USER_CREATE_PASS_CERROR';

export function createPassword(password) {
    return {
        [CALL_API]: {
            types: [USER_CREATE_PASS_REQUEST, USER_CREATE_PASS_SUCCESS, USER_CREATE_PASS_FAILURE],
            cError: USER_CREATE_PASS_CERROR,
            endpoint: USER_CREATE_PASS,
            body: {password},
        }
    }
}

export const USER_RECOVER_PASS_REQUEST = 'USER_RECOVER_PASS_REQUEST';
export const USER_RECOVER_PASS_SUCCESS = 'USER_RECOVER_PASS_SUCCESS';
export const USER_RECOVER_PASS_FAILURE = 'USER_RECOVER_PASS_FAILURE';
export const USER_RECOVER_PASS_CERROR = 'USER_RECOVER_PASS_CERROR';

export function recoverPassword(username) {
    return {
        [CALL_API]: {
            types: [USER_RECOVER_PASS_REQUEST, USER_RECOVER_PASS_SUCCESS, USER_RECOVER_PASS_FAILURE],
            cError: USER_RECOVER_PASS_CERROR,
            endpoint: USER_RECOVER_PASS,
            body: {username},
        }
    }
}

export const USER_CHANGE_MERCHANT_PASS_REQUEST = 'USER_CHANGE_MERCHANT_PASS_REQUEST';
export const USER_CHANGE_MERCHANT_PASS_SUCCESS = 'USER_CHANGE_MERCHANT_PASS_SUCCESS';
export const USER_CHANGE_MERCHANT_PASS_FAILURE = 'USER_CHANGE_MERCHANT_PASS_FAILURE';
export const USER_CHANGE_MERCHANT_PASS_CERROR = 'USER_CHANGE_MERCHANT_PASS_CERROR';

export function changeMerchantPassword(password, merchantId) {
    return {
        [CALL_API]: {
            types: [USER_CHANGE_MERCHANT_PASS_REQUEST, USER_CHANGE_MERCHANT_PASS_SUCCESS, USER_CHANGE_MERCHANT_PASS_FAILURE],
            cError: USER_CHANGE_MERCHANT_PASS_CERROR,
            endpoint: USER_CHANGE_MERCHANT_PASS(merchantId),
            body: {password},
        }
    }
}
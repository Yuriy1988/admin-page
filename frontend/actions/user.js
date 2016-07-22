import {CALL_API} from '../middleware/api';
import {USER_LOGIN} from '../lib/api'
import {USER_LOGOUT} from '../lib/api'

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


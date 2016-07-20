export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';
import { CALL_API } from '../middleware/api';
import {USER_LOGIN_AUTH} from '../lib/api'

export function login(login, password, redirectTo) {

    return {
        type: USER_LOGIN,
        login,
        password,
        redirectTo: redirectTo || "/admin"
    }
}


export function logout(redirectTo) {
    return {
        type: USER_LOGOUT,
        redirectTo: redirectTo || "/admin"
    }
}

// future implementation

//export const USER_LOGIN_AUTH_REQUEST = 'USER_LOGIN_AUTH_REQUEST';
//export const USER_LOGIN_AUTH_SUCCESS = 'USER_LOGIN_AUTH_SUCCESS';
//export const USER_LOGIN_AUTH_FAILURE = 'USER_LOGIN_AUTH_FAILURE';
//export const USER_LOGIN_AUTH_CERROR = 'USER_LOGIN_AUTH_CERROR';

//export function login_authError() {
//    return {
//        type: USER_LOGIN_AUTH_CERROR
//    }
//}
//
//export function login(username, password) {
//    return {
//        [CALL_API]: {
//            types: [USER_LOGIN_AUTH_REQUEST, USER_LOGIN_AUTH_SUCCESS, USER_LOGIN_AUTH_FAILURE],
//            cError: USER_LOGIN_AUTH_CERROR,
//            endpoint: USER_LOGIN_AUTH,
//            body: {username, password},
//        }
//    }
//}
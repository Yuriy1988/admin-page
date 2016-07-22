import {CALL_API} from '../middleware/api';
import {SERVER_VERSION_GET} from '../lib/api'
import {TOKEN_REFRESH} from '../lib/api'


export const SERVER_VERSION_REQUEST = 'SERVER_VERSION_REQUEST';
export const SERVER_VERSION_SUCCESS = 'SERVER_VERSION_SUCCESS';
export const SERVER_VERSION_FAILURE = 'SERVER_VERSION_FAILURE';
export const SERVER_VERSION_CERROR = 'SERVER_VERSION_CERROR';

export function serverRequestError() {
    return {
        type: SERVER_VERSION_CERROR
    }
}

export function getServerVersion() {
    return {
        [CALL_API]: {
            types: [SERVER_VERSION_REQUEST, SERVER_VERSION_SUCCESS, SERVER_VERSION_FAILURE],
            cError: SERVER_VERSION_CERROR,
            endpoint: SERVER_VERSION_GET,
        }
    }
}

export const TOKEN_REFRESH_REQUEST = 'TOKEN_REFRESH_REQUEST';
export const TOKEN_REFRESH_SUCCESS = 'TOKEN_REFRESH_SUCCESS';
export const TOKEN_REFRESH_FAILURE = 'TOKEN_REFRESH_FAILURE';
export const TOKEN_REFRESH_CERROR = 'TOKEN_REFRESH_CERROR';

export function refreshToken() {
    return {
        [CALL_API]: {
            types: [TOKEN_REFRESH_REQUEST, TOKEN_REFRESH_SUCCESS, TOKEN_REFRESH_FAILURE],
            cError: TOKEN_REFRESH_CERROR,
            endpoint: TOKEN_REFRESH,
        }
    }
}
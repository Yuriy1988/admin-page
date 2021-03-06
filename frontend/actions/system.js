import {CALL_API} from '../middleware/api';
import {SERVER_VERSION_GET} from '../lib/api'

export const SERVER_VERSION_REQUEST = 'SERVER_VERSION_REQUEST';
export const SERVER_VERSION_SUCCESS = 'SERVER_VERSION_SUCCESS';
export const SERVER_VERSION_FAILURE = 'SERVER_VERSION_FAILURE';
export const SERVER_VERSION_CERROR = 'SERVER_VERSION_CERROR';

export function serverRequestError() {
    return {
        type: SERVER_VERSION_CERROR
    }
}

export default function getServerVersion() {
    return {
        [CALL_API]: {
            types: [SERVER_VERSION_REQUEST, SERVER_VERSION_SUCCESS, SERVER_VERSION_FAILURE],
            cError: SERVER_VERSION_CERROR,
            endpoint: SERVER_VERSION_GET,
        }
    }
}
import {CALL_API} from '../middleware/api';
import {NOTIFICATIONS_GET} from '../lib/api'


export const NOTIFICATIONS_REQUEST = 'NOTIFICATIONS_REQUEST';
export const NOTIFICATIONS_SUCCESS = 'NOTIFICATIONS_SUCCESS';
export const NOTIFICATIONS_FAILURE = 'NOTIFICATIONS_FAILURE';
export const NOTIFICATIONS_CERROR = 'NOTIFICATIONS_CERROR';

export function notificationsRequestError() {
    return {
        type: NOTIFICATIONS_CERROR
    }
}

export function getNotifications() {
    return {
        [CALL_API]: {
            types: [NOTIFICATIONS_REQUEST, NOTIFICATIONS_SUCCESS, NOTIFICATIONS_FAILURE],
            cError: NOTIFICATIONS_CERROR,
            endpoint: NOTIFICATIONS_GET,
        }
    }
}

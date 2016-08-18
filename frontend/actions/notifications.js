import {CALL_API} from '../middleware/api';
import {NOTIFICATIONS_GET} from '../lib/api'
import {NOTIFICATION_GET_BY_ID} from '../lib/api'


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

export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';

export function clearNotifications() {
    return {
        type: CLEAR_NOTIFICATION
    }
}


export const NOTIFICATION_GET_REQUEST = 'NOTIFICATION_GET_REQUEST';
export const NOTIFICATION_GET_SUCCESS = 'NOTIFICATION_GET_SUCCESS';
export const NOTIFICATION_GET_FAILURE = 'NOTIFICATION_GET_FAILURE';
export const NOTIFICATION_GET_CERROR = 'NOTIFICATION_GET_CERROR';

export function getNotificationById(id) {
    return {
        [CALL_API]: {
            types: [NOTIFICATION_GET_REQUEST, NOTIFICATION_GET_SUCCESS, NOTIFICATION_GET_FAILURE],
            cError: NOTIFICATION_GET_CERROR,
            endpoint: NOTIFICATION_GET_BY_ID(id),
        }
    }
}

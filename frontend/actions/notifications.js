import {CALL_API} from '../middleware/api';
import {NOTIFICATIONS_GET} from '../lib/api'
import {NOTIFICATION_DELETE} from '../lib/api'
import {NOTIFICATION_GET_BY_ID} from '../lib/api'
import {NOTIFICATION_ADD} from '../lib/api'
import {NOTIFICATION_EDIT} from '../lib/api'



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

export const NOTIFICATION_DELETE_REQUEST = 'NOTIFICATION_DELETE_REQUEST';
export const NOTIFICATION_DELETE_SUCCESS = {name: 'NOTIFICATION_DELETE_SUCCESS', redirectTo: '/admin/administrator/notifications'};
export const NOTIFICATION_DELETE_FAILURE = 'NOTIFICATION_DELETE_FAILURE';
export const NOTIFICATION_DELETE_CERROR = 'NOTIFICATION_DELETE_CERROR';

export function deleteNotification(id) {
    return {
        [CALL_API]: {
            types: [NOTIFICATION_DELETE_REQUEST, NOTIFICATION_DELETE_SUCCESS, NOTIFICATION_DELETE_FAILURE],
            cError: NOTIFICATION_DELETE_CERROR,
            endpoint: NOTIFICATION_DELETE(id),
        },
        id: id
    }
}

export const NOTIFICATION_ADD_REQUEST = 'NOTIFICATION_ADD_REQUEST';
export const NOTIFICATION_ADD_SUCCESS = {name: 'NOTIFICATION_ADD_SUCCESS', redirectTo: '/admin/administrator/notifications'};
export const NOTIFICATION_ADD_FAILURE = 'NOTIFICATION_ADD_FAILURE';
export const NOTIFICATION_ADD_CERROR = 'NOTIFICATION_ADD_CERROR';

export function addNotification(body) {
    return {
        [CALL_API]: {
            types: [NOTIFICATION_ADD_REQUEST, NOTIFICATION_ADD_SUCCESS, NOTIFICATION_ADD_FAILURE],
            cError: NOTIFICATION_ADD_CERROR,
            endpoint: NOTIFICATION_ADD,
            body
        }
    }
}

export const NOTIFICATION_EDIT_REQUEST = 'NOTIFICATION_EDIT_REQUEST';
export const NOTIFICATION_EDIT_SUCCESS = {name: 'NOTIFICATION_EDIT_SUCCESS', redirectTo: '/admin/administrator/notifications'};
export const NOTIFICATION_EDIT_FAILURE = 'NOTIFICATION_EDIT_FAILURE';
export const NOTIFICATION_EDIT_CERROR = 'NOTIFICATION_EDIT_CERROR';

export function editNotification(body) {
    return {
        [CALL_API]: {
            types: [NOTIFICATION_EDIT_REQUEST, NOTIFICATION_EDIT_SUCCESS, NOTIFICATION_EDIT_FAILURE],
            cError: NOTIFICATION_EDIT_CERROR,
            endpoint: NOTIFICATION_EDIT,
            body
        }
    }
}
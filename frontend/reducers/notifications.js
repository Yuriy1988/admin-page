import * as NotificationActions from '../actions/notifications';

export default function notifications (state = {notifications: [], selectedNotification: {}}, action) {

    switch (action.type) {
        case NotificationActions.NOTIFICATIONS_REQUEST:
            return Object.assign({}, {isFetching: true}, state);

        case NotificationActions.NOTIFICATIONS_SUCCESS:
            return Object.assign({}, state, {isFetching: false}, action.response);

        case NotificationActions.CLEAR_NOTIFICATION:
            return Object.assign({}, {isFetching: false}, {notifications: [], selectedNotification: {}} );



        case NotificationActions.NOTIFICATION_GET_REQUEST:
            return Object.assign({}, {isFetching: true}, state);

        case NotificationActions.NOTIFICATION_GET_SUCCESS:
            console.log(action.response);
            return Object.assign({}, state, {isFetching: false}, {selectedNotification: action.response});
        default:
            return state;
    }
}
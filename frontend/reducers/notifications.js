import * as NotificationActions from '../actions/notifications';

const initialState = {
    iisFetching: false,
    notifications: [],
    error:''
};

export default function notifications(state = initialState, action) {

    switch (action.type) {
        case NotificationActions.NOTIFICATIONS_REQUEST:
            return Object.assign({}, state, {isFetching: true});

        case NotificationActions.NOTIFICATIONS_FAILURE:
            return Object.assign({}, state, {
                error: action.error.message,
                isFetching: false
            });
        case NotificationActions.NOTIFICATIONS_SUCCESS:
            return Object.assign({}, state, {isFetching: false}, action.response);

        case NotificationActions.CLEAR_NOTIFICATION:
            return Object.assign({}, {
                notifications: [],
                isFetching: false,
            });

        case NotificationActions.NOTIFICATION_DELETE_REQUEST:
            return Object.assign({}, state, {isFetching: true});

        case NotificationActions.NOTIFICATION_DELETE_SUCCESS:
            let result = [];
            state.notifications.filter(function (notification) {
                notification.id !== action.id ? result.push(notification) : ''
            });
            return Object.assign({}, state, {isFetching: false, notifications: result});

        case NotificationActions.NOTIFICATION_DELETE_FAILURE:
            return Object.assign({}, state, {isFetching: false, error: action.error.message});


        default:
            return state;
    }
}
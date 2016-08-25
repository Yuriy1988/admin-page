import * as NotificationActions from '../actions/notifications';

const initialState = {
    iisFetching: false,
    notifications: [],
    error:'',
    message: ''
};

export default function notifications(state = initialState, action) {

    switch (action.type) {
        case NotificationActions.NOTIFICATIONS_GET_REQUEST:
            return Object.assign({}, state, {isFetching: true});

        case NotificationActions.NOTIFICATIONS_GET_FAILURE:
            return Object.assign({}, state, {
                error: action.error.message,
                isFetching: false
            });
        case NotificationActions.NOTIFICATIONS_GET_SUCCESS:
            return Object.assign({}, state, {isFetching: false}, action.response);

        case NotificationActions.CLEAR_NOTIFICATIONS:
            return Object.assign({}, {
                notifications: [],
                isFetching: false,
            });

        case NotificationActions.NOTIFICATION_DELETE_REQUEST:
            return Object.assign({}, state, {isFetching: true});

        case NotificationActions.NOTIFICATION_DELETE_SUCCESS:
            let result = [];
            let notificationName = '';
                state.notifications.filter(function (notification) {
                    notification.id !== action.id ? result.push(notification) : notificationName = notification.name;
            });
            console.log(notificationName);
            return Object.assign({}, state, {isFetching: false, notifications: result}, {message: `notification ${notificationName} was deleted`});

        case NotificationActions.NOTIFICATION_DELETE_FAILURE:
            return Object.assign({}, state, {isFetching: false, error: action.error.message});


        default:
            return state;
    }
}
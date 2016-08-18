import * as NotificationActions from '../actions/notifications';

export default function notifications (state = {notifications: []}, action) {

    switch (action.type) {
        case NotificationActions.NOTIFICATIONS_REQUEST:
            return Object.assign({}, {isFetching: true}, state);

        case NotificationActions.NOTIFICATIONS_SUCCESS:
            return Object.assign({}, state, {isFetching: false}, action.response);

        default:
            return state;
    }
}
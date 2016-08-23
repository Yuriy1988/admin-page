import * as NotificationActions from '../actions/notifications';

const initialState = {
        error: {
            errors: {
                name: '',
                case_regex: '',
                case_template: '',
                body_template: '',
                subscribers_template: '',
                header_template: ''
            }
        },
        isFetching: false
};

export default function notification(state = initialState, action) {

    switch (action.type) {
        case NotificationActions.NOTIFICATIONS_REQUEST:
            return Object.assign({}, {isFetching: true}, state);

        case NotificationActions.NOTIFICATIONS_FAILURE:
            return Object.assign({}, state, {
                selectedNotification: action.response,
                error: action.error.message
            }, {isFetching: false});
        case NotificationActions.NOTIFICATIONS_SUCCESS:
            return Object.assign({}, state, {isFetching: false}, action.response);

        case NotificationActions.CLEAR_NOTIFICATION:
            return Object.assign({}, {
                notifications: [],
                isFetching: false,
                selectedNotification:{
                    error: {
                        errors: {
                            name: '',
                            case_regex: '',
                            case_template: '',
                            body_template: '',
                            subscribers_template: '',
                            header_template: ''
                        }
                    },
                    isFetching: false
                }
            });

        case NotificationActions.NOTIFICATION_GET_REQUEST:
            return Object.assign({}, {isFetching: true}, state);

        case NotificationActions.NOTIFICATION_GET_SUCCESS:
            return Object.assign({}, state, {isFetching: false}, {selectedNotification: action.response});

        case NotificationActions.NOTIFICATION_GET_FAILURE:
            return Object.assign({}, state, {isFetching: false}, {error: action.error.message});

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

        //add
        case  NotificationActions.NOTIFICATION_ADD_REQUEST:
            return Object.assign({}, state, {isFetching: true});
        case  NotificationActions.NOTIFICATION_ADD_SUCCESS:
            return Object.assign({}, state, {
                selectedNotification: {
                    isFetching: false, error: {
                        errors: {
                            name: '',
                            case_regex: '',
                            case_template: '',
                            body_template: '',
                            subscribers_template: '',
                            header_template: ''
                        }
                    }
                }
            });
        case  NotificationActions.NOTIFICATION_ADD_FAILURE:
            return Object.assign({}, state, {
                selectedNotification: {error: action.error.serverError, isFetching: false}
            });

        default:
            return state;
    }
}
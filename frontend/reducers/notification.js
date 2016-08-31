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

        case NotificationActions.NOTIFICATION_GET_REQUEST:
            return Object.assign({}, {isFetching: true}, state);

        case NotificationActions.NOTIFICATION_GET_SUCCESS:
            return Object.assign({}, state, {isFetching: false}, action.response);

        case NotificationActions.NOTIFICATION_GET_FAILURE:
            return Object.assign({}, state, {isFetching: false}, {error: action.error.message});

//edit
        case  NotificationActions.NOTIFICATION_EDIT_REQUEST:
            return Object.assign({}, state, {isFetching: true});
        case  NotificationActions.NOTIFICATION_EDIT_SUCCESS:
            return Object.assign({}, state, {isFetching: false}, action.response);
        case  NotificationActions.NOTIFICATION_EDIT_FAILURE:
            return Object.assign({}, state, {error: action.error.serverError || initialState.error, isFetching: false});

        case NotificationActions.NOTIFICATION_CLEAR:
            return initialState;
        default:
            return state;
    }
}
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

export default function notification_to_add (state = initialState, action) {

    switch (action.type) {

        case  NotificationActions.NOTIFICATION_ADD_REQUEST:
            return Object.assign({}, state, {isFetching: true});
        case  NotificationActions.NOTIFICATION_ADD_SUCCESS:
            return Object.assign({}, state, {
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
            });
        case  NotificationActions.NOTIFICATION_ADD_FAILURE:
            return Object.assign({}, state, {
                error: action.error.serverError, isFetching: false
            });

        case NotificationActions.NOTIFICATION_CLEAR:
            return initialState;
        default:
            return state;
    }
}
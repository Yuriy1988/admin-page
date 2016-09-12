import * as ManagerActions from '../actions/managers';

const initialState = {
        errors: {
            email: '',
            firstName: '',
            lastName: '',
            notify: '',
            phone: '',
            username: '',
        },
        isFetching: false
};

export default function manager_to_add (state = initialState, action) {

    switch (action.type) {

        case  ManagerActions.MANAGER_ADD_REQUEST:
            return Object.assign({}, state, {isFetching: true});

        case  ManagerActions.MANAGER_ADD_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false, error: {
                    errors: {
                        email: '',
                        firstName: '',
                        lastName: '',
                        notify: '',
                        phone: '',
                        username: ''
                    }
                }
            });
        case  ManagerActions.MANAGER_ADD_FAILURE:
            debugger;
            return Object.assign({}, state, {
                errors: action.error.serverError.errors.user, isFetching: false
            });

        case ManagerActions.MANAGER_CLEAR:
            return initialState;
        default:
            return state;
    }
}
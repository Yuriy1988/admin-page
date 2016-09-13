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
    user: {manager: {}},
    isFetching: false
};

export default function manager(state = initialState, action) {

    switch (action.type) {

        case ManagerActions.MANAGER_GET_REQUEST:
            return Object.assign({}, {isFetching: true}, state);

        case ManagerActions.MANAGER_GET_SUCCESS:
            return Object.assign({}, state, {isFetching: false}, action.response);

        case ManagerActions.MANAGER_GET_FAILURE:
            return Object.assign({}, state, {isFetching: false}, {error: action.error.message});

//edit
        case  ManagerActions.MANAGER_EDIT_REQUEST:
            return Object.assign({}, state, {isFetching: true});
        case  ManagerActions.MANAGER_EDIT_SUCCESS:
            return Object.assign({}, state, {isFetching: false}, action.response);
        case  ManagerActions.MANAGER_EDIT_FAILURE:
            return Object.assign({}, state, {error: action.error.serverError || initialState.error, isFetching: false});

        case ManagerActions.MANAGER_CLEAR:
            return initialState;
        default:
            return state;
    }
}
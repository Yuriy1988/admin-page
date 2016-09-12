import * as ManagersActions from '../actions/managers';

const initialState = {
    iisFetching: false,
    managerList: [],
    error:'',
    message: ''
};

export default function managerList(state = initialState, action) {

    switch (action.type) {
        case ManagersActions.MANAGERLIST_GET_REQUEST:
            return Object.assign({}, state, {isFetching: true});

        case ManagersActions.MANAGERLIST_GET_FAILURE:
            return Object.assign({}, state, {
                error: action.error.message,
                isFetching: false
            });
        case ManagersActions.MANAGERLIST_GET_SUCCESS:
            return Object.assign({}, state, {isFetching: false}, action.response);

        case ManagersActions.CLEAR_MANAGERLIST:
            return Object.assign({}, {
                managerList: [],
                isFetching: false,
            });

        case ManagersActions.MANAGER_DELETE_REQUEST:
            return Object.assign({}, state, {isFetching: true});

        case ManagersActions.MANAGER_DELETE_SUCCESS:
            let result = [];
            let managerName = '';
            state.managerList.filter(function (manager) {
                manager.id !== action.id ? result.push(manager) : managerName = manager.name;
            });
            return Object.assign({}, state, {isFetching: false, managerList: result}, {message: `Manager ${managerName} was deleted`});

        case ManagersActions.MANAGER_DELETE_FAILURE:
            return Object.assign({}, state, {isFetching: false, error: action.error.message});


        default:
            return state;
    }
}
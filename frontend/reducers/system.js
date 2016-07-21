import * as SystemActions from '../actions/system';

export const SERVER_VERSION_REQUEST = 'SERVER_VERSION_REQUEST';
export const SERVER_VERSION_SUCCESS = 'SERVER_VERSION_SUCCESS';
export const SERVER_VERSION_FAILURE = 'SERVER_VERSION_FAILURE';
export const SERVER_VERSION_CERROR = 'SERVER_VERSION_CERROR';

export default function system (state = {}, action) {

    switch (action.type) {
        case SystemActions.SERVER_VERSION_REQUEST:
            return Object.assign({}, state);

        case SystemActions.SERVER_VERSION_SUCCESS:
            console.log(action.response.token);
            //localStorage.setItem("server_version", action.response.token);
            return {}; // Object.assign({}, state, action.response)

        default:
            return state;
    }
}
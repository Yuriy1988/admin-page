import * as SystemActions from '../actions/system';


export default function system (state = {}, action) {

    switch (action.type) {
        case SystemActions.SERVER_VERSION_REQUEST:
            return Object.assign({}, state);

        case SystemActions.SERVER_VERSION_SUCCESS:
           localStorage.setItem("apiVersion", action.response.apiVersion);
            return {};

        default:
            return state;
    }
}
//
// export const SERVER_VERSION_REQUEST = 'SERVER_VERSION_REQUEST';
// export const SERVER_VERSION_SUCCESS = 'SERVER_VERSION_SUCCESS';
// export const SERVER_VERSION_FAILURE = 'SERVER_VERSION_FAILURE';
// export const SERVER_VERSION_CERROR = 'SERVER_VERSION_CERROR';
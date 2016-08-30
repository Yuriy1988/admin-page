import * as StoresActions from '../actions/stores';

export default function storeList (state = {stores:[]}, action) {

    switch (action.type) {

        case StoresActions.STORE_GET_ALL_SUCCESS:
            return Object.assign({}, action.response);

        default:
            return state;
    }
}
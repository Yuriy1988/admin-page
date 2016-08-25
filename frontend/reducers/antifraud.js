import * as AntifraudActions from '../actions/antifraud';


const initialState = {
    isFetching:false,
    error: {},
    rules: []
};

export default function antiFraud (state= {isFetching:false, error:{}}, action) {

    switch (action.type) {
        case AntifraudActions.ANTIFRAUD_GET_REQUEST:
            return Object.assign({}, state, {isFetching: true});

        case AntifraudActions.ANTIFRAUD_GET_SUCCESS:
            return Object.assign({}, state, action.response, {isFetching: false});

        case AntifraudActions.ANTIFRAUD_GET_FAILURE:
            return Object.assign({}, state, action.error, {isFetching: false});

        default:
            return state;
    }
}
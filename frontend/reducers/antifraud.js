import * as AntifraudActions from '../actions/antifraud';


const initialState = {
    isFetching:false,
    error: {},
    rules: [],
};

export default function antiFraud (state= {isFetching:false, error:{}, success: ''}, action) {

    switch (action.type) {

        case AntifraudActions.ANTIFRAUD_SETTINGS_GET_REQUEST:
            return Object.assign({}, {isFetching: true});

        case AntifraudActions.ANTIFRAUD_SETTINGS_GET_SUCCESS:
            return Object.assign({}, state, action.response, {isFetching: false});

        case AntifraudActions.ANTIFRAUD_SETTINGS_GET_FAILURE:
            return Object.assign({}, state, action.error, {isFetching: false});

        case AntifraudActions.ANTIFRAUD_SETTINGS_SET_REQUEST:
            return Object.assign({}, state, {isFetching: true, success: ''});

        case AntifraudActions.ANTIFRAUD_SETTINGS_SET_SUCCESS:
            return Object.assign({}, state, action.response, {isFetching: false, success: 'Anti-fraud rules were updated'});

        case AntifraudActions.ANTIFRAUD_SETTINGS_SET_FAILURE:
            return Object.assign({}, state, action.error, {isFetching: false});




        case AntifraudActions.ANTIFRAUD_GET_REQUEST:
            return Object.assign({}, {isFetching: true});

        case AntifraudActions.ANTIFRAUD_GET_SUCCESS:
            return Object.assign({}, state, action.response, {isFetching: false});

        case AntifraudActions.ANTIFRAUD_GET_FAILURE:
            return Object.assign({}, state, action.error, {isFetching: false});
        //set

        case AntifraudActions.ANTIFRAUD_PUT_REQUEST:
            return Object.assign({}, state, {isFetching: true, success: ''});

        case AntifraudActions.ANTIFRAUD_PUT_SUCCESS:
            return Object.assign({}, state, action.response, {isFetching: false,
                success: 'Anti-fraud rules were updated'});

        case AntifraudActions.ANTIFRAUD_PUT_FAILURE:
            return Object.assign({}, state, action.error, {isFetching: false});

        default:
            return state;
    }
}
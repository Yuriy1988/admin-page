import * as UserActions from '../actions/user';
// Creates a reducer managing pagination, given the action types to handle,
// and a function telling how to extract the key from an action.

let initial_user;
if (localStorage.user) {
    initial_user = JSON.parse(localStorage.user)
} else {
    initial_user = {
        isFetching: false
    };
}

export default function user(state = initial_user, action) {

    switch (action.type) {
        //login
        case UserActions.USER_LOGIN_REQUEST:
            return Object.assign({}, state, {isFetching: true});

        case UserActions.USER_LOGIN_SUCCESS:
            let path = '';
            if (action.response.groups[0] === 'admin') {
                path = 'administrator';
            } else {
                path = 'anotherPath'; // todo: handle roles here;
            }

            localStorage.setItem("user_token", action.response.token);

            return Object.assign({}, state, action.response,
                {isFetching: false},
                {mainPage: `/admin/${path}`});

        case UserActions.USER_LOGIN_FAILURE:
            return {error: "Wrong username or password", isFetching: false};

        //logout
        case UserActions.USER_LOGOUT_REQUEST:
            return {};

        case UserActions.USER_LOGOUT_FAILURE:
            return {};

        case UserActions.USER_LOGOUT_SUCCESS:
            localStorage.setItem("user_token", '');
            localStorage.setItem("user", '');
            return Object.assign({}, state, {isFetching: false});

        //create pass
        case UserActions.USER_CREATE_PASS_REQUEST:
            return Object.assign({}, state, {isFetching: true});

        case UserActions.USER_CREATE_PASS_SUCCESS:
            return {success: "Now you can use your password to login on the main page", isFetching: false};

        case UserActions.USER_CREATE_PASS_FAILURE:
            return {error: "The password must consist more than 8 characters", isFetching: false};

        case UserActions.USER_CREATE_PASS_CERROR:
            return {};

        //recover pass

        case UserActions.USER_RECOVER_PASS_REQUEST:
            return Object.assign({}, state, {isFetching: true});

        case UserActions.USER_RECOVER_PASS_SUCCESS:
            return {success: "Check your e-mail to recover your password", isFetching: false};

        case UserActions.USER_RECOVER_PASS_FAILURE:
            return {error: "Wrong username", isFetching: false};

        case UserActions.USER_RECOVER_PASS_CERROR:
            return {};

        //merchant pass changing

        case UserActions.USER_CHANGE_MERCHANT_PASS_REQUEST:
            return Object.assign({}, state, {isFetching: true});

        case UserActions.USER_CHANGE_MERCHANT_PASS_SUCCESS:
            return Object.assign({}, state, {
                success: "The password of current merchant was changed",
                isFetching: false
            });

        case UserActions.USER_CHANGE_MERCHANT_PASS_FAILURE:
            return Object.assign({}, state, {
                error: "The password must consist more than 8 characters",
                isFetching: false
            });

        case UserActions.USER_CHANGE_MERCHANT_PASS_CERROR:

        //self pass changing
        case UserActions.USER_CHANGE_SELF_PASS_REQUEST:
            return Object.assign({}, state, {isFetching: true});

        case UserActions.USER_CHANGE_SELF_PASS_SUCCESS:
            return Object.assign({}, state, {success: "Your password was changed, please re-login", isFetching: false});

        case UserActions.USER_CHANGE_SELF_PASS_FAILURE:
            return Object.assign({}, state, {error: "You have entered wrong values", isFetching: false}); //todo: refactor

        case UserActions.USER_CHANGE_SELF_PASS_CERROR:
            return {};


        //get admin statistic

        case UserActions.USER_GET_ADMIN_STAT_REQUEST:
            return Object.assign({}, state, {isFetching: true});

        case UserActions.USER_GET_ADMIN_STAT_SUCCESS:
            console.log(action.response);
            return Object.assign({}, state, {isFetching: false});

        case UserActions.USER_GET_ADMIN_STAT_FAILURE:
            return Object.assign({}, state, {error: "something went wrong", isFetching: false});

        case UserActions.USER_GET_ADMIN_STAT_CERROR:
            return {};

        default:
            return state;
    }
}
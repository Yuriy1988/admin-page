import * as UserActions from '../actions/user';
// Creates a reducer managing pagination, given the action types to handle,
// and a function telling how to extract the key from an action.

const initial_user = {
    isFetching: false
};

export default function user(state = initial_user, action) {

    switch (action.type) {
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
            return {error: "Wrong username or password"}

        case UserActions.USER_LOGOUT_REQUEST:
            return Object.assign({}, state, action.response,
                {isFetching: false});

        case UserActions.USER_LOGOUT_FAILURE:
            console.log('err while logging out');
            return {};

        case UserActions.USER_LOGOUT_SUCCESS:
            localStorage.setItem("user_token", '');
            return {};

        default:
            return state;
    }
}

import * as UserActions from '../actions/user';
// Creates a reducer managing pagination, given the action types to handle,
// and a function telling how to extract the key from an action.

const initial_user = {
    isFetching: false
};

export default function user(state = initial_user, action) {

   //switch (action.type) {
   //    case UserActions.USER_LOGIN_AUTH_REQUEST:
   //        return Object.assign({}, state, {isFetching: true});
   //
   //    case UserActions.USER_LOGIN_AUTH_SUCCESS:
   //        localStorage.setItem("user_token", action.response.token);
   //        console.log(action.response);
   //        return Object.assign({}, state, action.response, {isFetching: false}, {mainPage: "/admin/administrator"});
   //
   //    case UserActions.USER_LOGIN_AUTH_FAILURE:
   //        return Object.assign({}, state, action.error, {isFetching: false});
   //    default:
   //        return state;
   //}


    const { type } = action;

    if (type === UserActions.USER_LOGIN) {
        if (action.login === 'test' && action.password === "test") {
            localStorage.setItem("user_token", "fhajk8f9ahskfas9fyasfs890a");
            return {
                name: "Vlad",
                login: action.login,
                mainPage: "/admin/administrator",
                roles: ["ROLE_ADMINISTRATOR"],
                token: "fhajk8f9ahskfas9fyasfs890a"
            };
        }else{
            return {
                error: "Wrong username or password"
            };
        }
    }

    if (type === UserActions.USER_LOGOUT) {
        localStorage.removeItem("user_token");
        return {};
    }

    return state;
}

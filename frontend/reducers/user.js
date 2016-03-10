import * as UserActions from '../actions/user';
// Creates a reducer managing pagination, given the action types to handle,
// and a function telling how to extract the key from an action.

const initial_user = (DEV_MODE ) ? {
    name: "Vlad",
    login: "vladik7244",
    mainPage: "/admin/administrator",
    roles: ["ROLE_ADMINISTRATOR"],
    token: "fhajk8f9ahskfas9fyasfs890a"
} : {
};

export default function user(state = initial_user, action) {
    const { type } = action;

    if (type === UserActions.USER_LOGIN) {
        if (action.login === 'test' && action.password === "test") {
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
        return {};
    }

    return state;
}

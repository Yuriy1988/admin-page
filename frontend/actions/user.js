export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';

export function login(login, password, redirectTo) {

    console.log('16661');
    return {
        type: USER_LOGIN,
        login,
        password,
        redirectTo: redirectTo || "/admin"
    }
}


export function logout(redirectTo) {
    return {
        type: USER_LOGOUT,
        redirectTo: redirectTo || "/admin"
    }
}
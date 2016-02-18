export const USER_LOGIN = 'USER_LOGIN';

export function login(login, password) {
    return {
        type: USER_LOGIN,
        login,
        password
    }
}
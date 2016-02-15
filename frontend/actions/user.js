
export const USER_LOGIN = 'USER_LOGIN';

export function login(name) {
    return {
        type: USER_LOGIN,
        name: name || "Hello from actions"
    }
}
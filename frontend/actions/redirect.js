export function redirect(redirectTo) {
    return {
        type: "__REDIRECT_TYPE",
        redirectTo
    }
}

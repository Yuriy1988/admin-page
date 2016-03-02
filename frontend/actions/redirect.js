export function redirect(redirectTo) {
    return {
        type: "__REDIRECT_TYPE",
        redirectTo
    }
}
export function back() {
    return {
        type: "__REDIRECT_TYPE",
        redirectTo: "_back_"
    }
}

export function redirect(redirectTo, cleanPagination = false) {
    return {
        type: "__REDIRECT_TYPE",
        redirectTo,
        cleanPagination
    }
}
export function back(cleanPagination = false) {
    return {
        type: "__REDIRECT_TYPE",
        redirectTo: "_back_",
        cleanPagination
    }
}

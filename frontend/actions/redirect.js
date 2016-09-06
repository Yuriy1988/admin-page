export const REDIRECT_TYPE = "__REDIRECT_TYPE";
export const REDIRECTTO_PREV_PAGE = "_back_";
export function redirect(redirectTo) {
    return {
        type: REDIRECT_TYPE,
        redirectTo
    }
}

export function back(cleanPagination = false) {

    return {
        type: REDIRECT_TYPE,
        redirectTo: REDIRECTTO_PREV_PAGE,
        cleanPagination
    }
}
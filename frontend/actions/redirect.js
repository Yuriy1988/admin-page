export const REDIRECT_TYPE = "__REDIRECT_TYPE";
export const REDIRECTTO_PREV_PAGE = "_back_";

/**
 * Redirect to the URL, optional clear tha pagination from store
 * @param redirectTo URL String "/admin/administrator"
 * @param cleanPagination Boolean [default false] is need clear pagination
 * @returns action which redirect to the page
 */
export function redirect(redirectTo, cleanPagination = false) {
    return {
        type: REDIRECT_TYPE,
        redirectTo,
        cleanPagination
    }
}
/**
 * Redirect to the previous page, optional clear tha pagination from store
 * @param cleanPagination Boolean [default false] is need clear pagination
 * @returns {{type: string, redirectTo: string, clear: boolean}}
 */
export function back(cleanPagination = false) {
    return {
        type: REDIRECT_TYPE,
        redirectTo: REDIRECTTO_PREV_PAGE,
        cleanPagination
    }
}

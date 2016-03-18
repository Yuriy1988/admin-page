/**
 * Created by gasya on 11.03.16.
 * DigitalOutlooks corporation.
 */

export const CLEAR_PAGINATION = "CLEAR_PAGINATION";
export const ALL_PAGINATIONS = "ALL_PAGINATIONS";
export function clear(paginationId = undefined) {
    return {
        type: CLEAR_PAGINATION,
        paginationId
    }
}
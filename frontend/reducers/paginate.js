import merge from 'lodash/merge'
import union from 'lodash/union'
import {PaginationActions} from '../actions/index'
// Creates a reducer managing pagination, given the action types to handle,
// and a function telling how to extract the key from an action.
export default function paginate({types, mapActionToKey, cError, entity, paginationId, init}) {
    if (!Array.isArray(types) || types.length !== 3) {
        throw new Error('Expected types to be an array of three elements.')
    }
    if (!types.every(t => typeof t === 'string' || typeof t === 'object')) {
        throw new Error('Expected types to be strings.')
    }
    if (typeof mapActionToKey !== 'function') {
        throw new Error('Expected mapActionToKey to be a function.')
    }

    let [ requestType, successType, failureType ] = types;
    if (typeof requestType == 'object') requestType = requestType.type;
    if (typeof successType == 'object') successType = successType.type;
    if (typeof failureType == 'object') failureType = failureType.type;

    const initState = {
        isFetching: false,
        nextPageUrl: undefined,
        pageCount: 0,
        ids: (init) ? init : [],
        result: null,
        success: false,
        error: null
    };

    return function updatePagination(stateOrigin = initState, actionOrigin) {
        const action = merge({}, actionOrigin);
        const state = merge({}, stateOrigin);
        const key = mapActionToKey(action);
        if (!!cError) {
            if (action.type === cError) {
                return Object.assign({}, state, {
                    error: null
                });
            }
        }


        if (!!entity) {
            if (!!action.deleteObject && action.deleteObject.entity == entity) {
                state.ids = state.ids.filter((id) => id != action.deleteObject.id);
            }
        }

        switch (action.type) {
            case requestType:
                return Object.assign({}, state, {
                    isFetching: true,
                    error: null,
                    success: false
                });
            case successType:
                const response = action.response;
                let ids = [];
                if (!!response.result[key]) {
                    ids = response.result[key]
                }
                return Object.assign({}, state, {
                    isFetching: false,
                    ids,
                    result: response.result,
                    nextPageUrl: response.nextPageUrl,
                    pageCount: state.pageCount + 1,
                    error: null,
                    success: true
                });
            case failureType:
                return Object.assign({}, state, {
                    isFetching: false,
                    error: action.error,
                    success: false
                });
            case PaginationActions.CLEAR_PAGINATION:
                if (paginationId == PaginationActions.ALL_PAGINATIONS) {
                    return initState;
                }
                if (typeof paginationId !== "undefined" && action.paginationId === paginationId) {
                    return initState;
                } else {
                    return state;
                }
            default:
                return state
        }
    }
}

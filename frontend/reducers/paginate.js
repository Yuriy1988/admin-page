import merge from 'lodash/merge'
import union from 'lodash/union'

// Creates a reducer managing pagination, given the action types to handle,
// and a function telling how to extract the key from an action.
export default function paginate({ types, mapActionToKey, cError }) {
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

    return function updatePagination(state = {
        isFetching: false,
        nextPageUrl: undefined,
        pageCount: 0,
        ids: [],
        result: null,
        success: false,
        error: null
    }, action) {
        const key = mapActionToKey(action);
        if (!!cError) {
            if (action.type === cError) {
                return merge({}, state, {
                    error: null
                });
            }
        }
        switch (action.type) {
            case requestType:
                return merge({}, state, {
                    isFetching: true,
                    error: null,
                    success: false
                });
            case successType:
                return merge({}, state, {
                    isFetching: false,
                    ids: union(state.ids, action.response.result[key]),
                    result: action.response.result,
                    nextPageUrl: action.response.nextPageUrl,
                    pageCount: state.pageCount + 1,
                    error: null,
                    success: true
                });
            case failureType:
                return merge({}, state, {
                    isFetching: false,
                    error: action.error,
                    success: false
                });
            default:
                return state
        }
    }
}

import merge from 'lodash/merge'
import union from 'lodash/union'

// Creates a reducer managing pagination, given the action types to handle,
// and a function telling how to extract the key from an action.
export default function paginate({ types, mapActionToKey }) {
    if (!Array.isArray(types) || types.length !== 3) {
        throw new Error('Expected types to be an array of three elements.')
    }
    if (!types.every(t => typeof t === 'string')) {
        throw new Error('Expected types to be strings.')
    }
    if (typeof mapActionToKey !== 'function') {
        throw new Error('Expected mapActionToKey to be a function.')
    }

    const [ requestType, successType, failureType ] = types;

    return function updatePagination(state = {
        isFetching: false,
        nextPageUrl: undefined,
        pageCount: 0,
        ids: []
    }, action) {
        const key = mapActionToKey(action);
        switch (action.type) {
            case requestType:
                return merge({}, state, {
                    isFetching: true
                });
            case successType:
                return merge({}, state, {
                    isFetching: false,
                    ids: union(state.ids, action.response.result[key]),
                    nextPageUrl: action.response.nextPageUrl,
                    pageCount: state.pageCount + 1
                });
            case failureType:
                return merge({}, state, {
                    isFetching: false
                });
            default:
                return state
        }
    }
}

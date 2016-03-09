import {DictionaryActions} from '../actions';
// Creates a reducer managing pagination, given the action types to handle,
// and a function telling how to extract the key from an action.

const initial_dict = {
    signAlgorithm: [],
    currency: [],
    category: [],
    notify: [],
    paysysId: []
};

export default function user(state = initial_dict, action) {
    const { type } = action;

    if (type === DictionaryActions.DICT_UPDATE_SUCCESS) {
        return Object.assign({}, state, action.response);
    }

    return state;
}

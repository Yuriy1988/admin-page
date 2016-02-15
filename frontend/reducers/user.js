import * as UserActions from '../actions/user';
// Creates a reducer managing pagination, given the action types to handle,
// and a function telling how to extract the key from an action.
export default function user(state = {name: null, login: null}, action) {
    const { type } = action;

    if (type === UserActions.USER_LOGIN) {
        return Object.assign({}, state, {
            name: "Vlad",
            login: "vladik7244"
        });
    }

    return state;
}

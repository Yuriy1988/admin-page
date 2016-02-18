import * as SideBarActions from '../actions/sideBar';
// Creates a reducer managing pagination, given the action types to handle,
// and a function telling how to extract the key from an action.
export default function sideBar(state = {display: false, enable: false}, action) {
    const { type } = action;

    let result = {};

    switch (type) {
        case SideBarActions.SIDEBAR_SHOW:
            result = Object.assign({}, state, {
                display: true
            });
            break;
        case SideBarActions.SIDEBAR_HIDE:
            result = Object.assign({}, state, {
                display: false
            });
            break;
        case SideBarActions.SIDEBAR_TOGGLE:
            result = Object.assign({}, state, {
                display: !state.display
            });
            break;
        case SideBarActions.SIDEBAR_ENABLE:
            result = Object.assign({}, state, {
                enable: true,
                display:true
            });
            break;
        case SideBarActions.SIDEBAR_DISABLE:
            result = Object.assign({}, state, {
                enable: false,
                display:false
            });
            break;
        default:
            result = state;
    }

    return result;
}

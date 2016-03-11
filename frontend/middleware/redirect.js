import { browserHistory } from 'react-router'
import {cleanPagination} from '../actions/pagination'
export default store => next => action => {

    let newAction = Object.assign({}, action);

    if (!!action.redirectTo) {
        delete newAction.redirectTo;
    }

    if (!!action.cleanPagination) {
        next(cleanPagination());
        delete newAction.cleanPagination;
    }

    next(newAction);

    if (!!action.redirectTo) {
        switch(action.redirectTo) {
            case "_back_":
                browserHistory.goBack();
                break;
            default:
                browserHistory.push(action.redirectTo);
                break;
        }
    }
}

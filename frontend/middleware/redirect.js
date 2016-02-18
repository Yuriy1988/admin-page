import { browserHistory } from 'react-router'

export default store => next => action => {

    let newAction = Object.assign({}, action);

    if (!!action.redirectTo) {
        delete newAction.redirectTo;
    }

    next(newAction);

    if (!!action.redirectTo) {
        browserHistory.push(action.redirectTo);
    }


}

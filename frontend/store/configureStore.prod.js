import { createStore, applyMiddleware } from 'redux'
import { syncHistory } from 'react-router-redux'
import { browserHistory } from 'react-router'
import thunk from 'redux-thunk'
import api from '../middleware/api'
import redirect from '../middleware/redirect'
import rootReducer from '../reducers'

export default function configureStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware( thunk, api, redirect, syncHistory(browserHistory))
    )
}

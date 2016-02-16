import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import Routes from '../routes'
import { Router, browserHistory } from 'react-router'

export default class Root extends Component {
    render() {
        const { store } = this.props;
        const routes = new Routes(store);
        return (
            <Provider store={store}>
                <Router history={browserHistory} routes={routes.getRoutes()}/>
            </Provider>
        )
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired
};

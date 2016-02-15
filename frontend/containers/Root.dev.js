import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import Routes from '../routes'
import DevTools from './DevTools'
import { Router, browserHistory } from 'react-router'



export default class Root extends Component {
    render() {
        const { store } = this.props;
        const routes = new Routes(store);
        return (
            <Provider store={store}>
                <div>
                    <Router history={browserHistory} routes={routes.getRoutes()}/>
                    <DevTools />
                </div>
            </Provider>
        )
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired
};

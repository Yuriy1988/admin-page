import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import routes from '../routes'
import { Router, browserHistory } from 'react-router'

export default class Root extends Component {
    render() {
        const { store } = this.props;
        const routes = new Routes(store);
        return (
            <Provider store={store}>
                <Router history={browserHistory} routes={routes}/>
            </Provider>
        )
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired
};

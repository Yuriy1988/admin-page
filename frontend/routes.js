import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'

import UserPage from './containers/UserPage'
import LoginPage from './containers/LoginPage'
import RepoPage from './containers/RepoPage'
import TestPage from './containers/TestPage'
import NotFoundPage from './containers/NotFoundPage'
import AdminPage from './containers/AdminPage'


class Routes {
    constructor(store) {
        this.store = store;
    }

    requireLogin(nextState, replace, cb) {
        console.log("NS", nextState);
        console.log("RS", replace);
        //cb();
        function checkAuth() {
            //const { auth: { user }} = store.getState();
            if (typeof user !== "undefined" || true) {
                // oops, not logged in, so can't be here!
                replace('/admin/login');
            }
            cb();
        }

        /*  if (!isAuthLoaded(store.getState())) {
         store.dispatch(loadAuth()).then(checkAuth);
         } else {*/
        checkAuth();
        //}
    }


    getRoutes() {
        return (
            <Route component={App}   >
                <Route path="/admin"  onEnter={this.requireLogin}>
                    <IndexRoute component={AdminPage} />

                    <Route path="test"
                           component={TestPage}/>


                </Route>
                <Route path="/admin/login"
                       component={LoginPage}/>

                <Route path="*" component={NotFoundPage} status={404}/>
            </Route>
        );
    }
}


export default Routes

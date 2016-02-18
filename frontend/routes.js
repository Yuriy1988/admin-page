import React            from 'react'
import { Route, IndexRoute } from 'react-router'
import App              from './containers/App'

import Content          from './components/Content'

import AccessDenied     from './containers/AccessDenied'
import UserPage         from './containers/UserPage'
import LoginPage        from './containers/LoginPage'
import RepoPage         from './containers/RepoPage'
import TestPage         from './containers/TestPage'
import NotFoundPage     from './containers/NotFoundPage'
import AdminPage        from './containers/AdminPage'
import SelectRolePage   from './containers/SelectRolePage'
import NoticePage       from './containers/pages/Notice'
import Merchants        from './containers/pages/Merchants'
import MerchantAddForm  from './components/MerchantAddForm'
import MerchantList  from './components/MerchantList'

//TODO fix hardcode. Move to separate module
const ROLE = {
    ADMINISTRATOR: "ROLE_ADMINISTRATOR",
    MERCHANT: "ROLE_MERCHANT",
    MANAGER: "ROLE_MANAGER"
};


class Routes {
    constructor(store) {
        this.store = store;
        this.requireLogin = this.requireLogin.bind(this);
        this.redirectToMain = this.redirectToMain.bind(this);
        this.requireRole = this.requireRole.bind(this);
    }

    requireLogin(nextState, replace, cb) {

        console.log("TEST LOGIN");

        const checkAuth = (store) => {
            const { user} = store.getState();

            if (!user) {
                // oops, not logged in, so can't be here!
                replace('/admin/login');
            }
            cb();
        };


        /*  if (!isAuthLoaded(store.getState())) {
         store.dispatch(loadAuth()).then(checkAuth);
         } else {*/
        checkAuth(this.store);
        //}
    }

    redirectToMain(nextState, replace, cb) {
        const { user } = this.store.getState();

        if (!user) {
            replace('/admin/login');
        } else {
            if (user.mainPage) {
                replace(user.mainPage);

            }
        }
        cb();
    }

    requireRole(role) {
        return ((nextState, replace, cb) => {
            const { user } = this.store.getState();
            let accessDenied = true;
            if (!!user) {
                if (!!user.roles) {
                    if (user.roles.indexOf(role) !== -1) {
                        accessDenied = false;
                    }
                }
            }

            if (accessDenied) {
                replace('/admin/access_denied');
            }

            cb();
        }).bind(this);
    }


    getRoutes() {
        return (
            <Route component={App}>

                <Route path="/admin/login" component={LoginPage}/>
                <Route path="/admin/access_denied" component={Content}>
                    <IndexRoute component={AccessDenied} status={403}/>
                </Route>

                <Route path="/admin">
                    <IndexRoute onEnter={this.redirectToMain} component={SelectRolePage}/>
                    <Route path="administrator" component={AdminPage} onEnter={this.requireRole(ROLE.ADMINISTRATOR)}>
                        <IndexRoute onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                        <Route path="notice" component={NoticePage} onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                        <Route path="merchants" component={Merchants} onEnter={this.requireRole(ROLE.ADMINISTRATOR)}>
                            <Route path="add" component={MerchantAddForm} onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                            <Route path="list" component={MerchantList} onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                        </Route>
                        <Route path="*" component={NotFoundPage} status={404} onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                    </Route>
                </Route>

                <Route path="*" component={Content}>
                    <IndexRoute component={NotFoundPage} status={404}/>
                </Route>
            </Route>
        );
    }
}


export default Routes

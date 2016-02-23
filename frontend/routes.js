import React            from 'react'
import { Route, IndexRoute } from 'react-router'
import App              from './containers/App'


import ErrorPage        from './containers/ErrorPage'

import UserPage         from './containers/UserPage'
import LoginPage        from './containers/LoginPage'
import RepoPage         from './containers/RepoPage'
import TestPage         from './containers/TestPage'
import AdminPage        from './containers/AdminPage'
import SelectRolePage   from './containers/SelectRolePage'
import NoticePage       from './containers/pages/Notice'
import Merchants        from './containers/pages/Merchants'
import MerchantAddForm  from './components/MerchantAddForm'
import MerchantList     from './components/MerchantList'

//TODO fix hardcode. Move to separate module
const ROLE = {
    ADMINISTRATOR: "ROLE_ADMINISTRATOR",
    MERCHANT: "ROLE_MERCHANT",
    MANAGER: "ROLE_MANAGER"
};


class Routes {
    constructor(store) {
        this.store = store;
        this.redirectToMain = this.redirectToMain.bind(this);
        this.requireRole = this.requireRole.bind(this);
    }

    getRoutes() {
        return (
            <Route component={App}>

                <Route path="/admin/login" component={LoginPage}/>

                <Route path="/admin/access_denied" component={ErrorPage} status={403} />

                <Route path="/admin">
                    <IndexRoute onEnter={this.redirectToMain} component={SelectRolePage}/>

                    <Route path="administrator" component={AdminPage} onEnter={this.requireRole(ROLE.ADMINISTRATOR)}>
                        <IndexRoute onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                        <Route path="notice" component={NoticePage} onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                        <Route path="merchants" component={Merchants} onEnter={this.requireRole(ROLE.ADMINISTRATOR)}>
                            <Route path="add" component={MerchantAddForm} onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                            <Route path="list" component={MerchantList} onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                        </Route>
                        {/*<Route path="*" component={NotFoundPage} status={404} onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>*/}
                    </Route>

                </Route>

                <Route path="*" component={ErrorPage} status={404}/>
            </Route>
        );
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

}


export default Routes

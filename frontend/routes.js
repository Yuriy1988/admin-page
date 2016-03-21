import React            from 'react'
import { Route, IndexRoute } from 'react-router'
import App              from './containers/App'


import ErrorPage        from './containers/ErrorPage'

import LoginPage        from './containers/LoginPage'
import TestPage         from './containers/TestPage'
import AdminPage        from './containers/AdminPage'
import SelectRolePage   from './containers/SelectRolePage'
import NotificationsPage       from './containers/pages/NotificationsPage'
import Merchants        from './containers/pages/Merchants'

import MerchantList     from './components/MerchantList'

import MerchantPage     from './containers/merchants/MerchantPage'
import MerchantInfoPage from './containers/merchants/MerchantInfoPage'
import MerchantAddPage  from './containers/merchants/MerchantAddPage'
import MerchantEditPage from './containers/merchants/MerchantEditPage'

import StoresPage       from './containers/stores/StoresPage' //Container
import StoreAddPage     from './containers/stores/StoreAddPage'
import StoreEditPage    from './containers/stores/StoreEditPage'
import StoreListPage    from './containers/stores/StoreListPage'
import StorePage        from './containers/stores/StorePage'
import StoreStatPage    from './containers/stores/StoreStatPage'

import MerchantContractsPage       from './containers/merchantContracts/MerchantContractsPage' //Container
import MerchantContractAddPage     from './containers/merchantContracts/MerchantContractAddPage'
import MerchantContractEditPage    from './containers/merchantContracts/MerchantContractEditPage'
import MerchantContractListPage    from './containers/merchantContracts/MerchantContractListPage'
import MerchantContractPage        from './containers/merchantContracts/MerchantContractPage'
import MerchantContractStatPage    from './containers/merchantContracts/MerchantContractStatPage'

import CurrenciesPage   from './containers/pages/CurrenciesPage';

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
            <Route>
                <Route path="/admin/login" component={LoginPage}/>
                <Route component={App}>


                    <Route path="/admin/access_denied" component={ErrorPage} status={403}/>

                    <Route path="/admin">
                        <IndexRoute onEnter={this.redirectToMain} component={SelectRolePage}/>

                        <Route path="administrator" component={AdminPage}
                               onEnter={this.requireRole(ROLE.ADMINISTRATOR)}>
                            <IndexRoute onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                            <Route path="notifications" component={NotificationsPage}
                                   onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>

                            <Route path="merchants" component={Merchants}
                                   onEnter={this.requireRole(ROLE.ADMINISTRATOR)}>
                                <Route path="add" component={MerchantAddPage}
                                       onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                                <Route path="list" component={MerchantList}
                                       onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                                <Route path=":merchantId" component={MerchantPage}
                                       onEnter={this.requireRole(ROLE.ADMINISTRATOR)}>
                                    <IndexRoute onEnter={this.requireRole(ROLE.ADMINISTRATOR)}
                                                component={MerchantInfoPage}/>
                                    <Route path="stores" component={StoresPage}
                                           onEnter={this.requireRole(ROLE.ADMINISTRATOR)}>
                                        <IndexRoute component={StoreListPage}
                                                    onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                                        <Route path="add" component={StoreAddPage}
                                               onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                                    </Route>
                                    <Route path="contracts" component={MerchantContractsPage}
                                           onEnter={this.requireRole(ROLE.ADMINISTRATOR)}>
                                        <IndexRoute component={MerchantContractListPage}
                                                    onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                                        <Route path="add" component={MerchantContractAddPage}
                                               onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                                        <Route path=":merchantContractId"
                                               onEnter={this.requireRole(ROLE.ADMINISTRATOR)}>
                                            <Route path="edit" component={MerchantContractEditPage}
                                                   onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                                        </Route>
                                    </Route>
                                    <Route path="edit" component={MerchantEditPage}
                                           onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                                </Route>
                            </Route>
                            <Route path="stores" component={StoresPage}
                                   onEnter={this.requireRole(ROLE.ADMINISTRATOR)}>
                                <Route path=":storeId" onEnter={this.requireRole(ROLE.ADMINISTRATOR)}>
                                    <IndexRoute onEnter={this.requireRole(ROLE.ADMINISTRATOR)} component={StorePage}/>
                                    <Route path="stat" component={StoreStatPage}
                                           onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                                    <Route path="edit" component={StoreEditPage}
                                           onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                                </Route>
                            </Route>
                            <Route path="currencies" component={CurrenciesPage}
                                   onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>
                            {/*<Route path="*" component={NotFoundPage} status={404} onEnter={this.requireRole(ROLE.ADMINISTRATOR)}/>*/}
                        </Route>

                    </Route>

                    <Route path="*" component={ErrorPage} status={404}/>
                </Route>
            </Route>
        );
    }

    redirectToMain(nextState, replace, cb) {
        const { user } = this.store.getState();

        if (!user.token) {
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

            if (!user.token) {
                accessDenied = true;
            }

            if (accessDenied) {
                replace('/admin/access_denied');
            }

            cb();
        }).bind(this);
    }

}


export default Routes

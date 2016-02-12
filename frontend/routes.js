import React from 'react'
import { Route } from 'react-router'
import App from './containers/App'

import UserPage from './containers/UserPage'
import RepoPage from './containers/RepoPage'
import NotFoundPage from './containers/NotFoundPage'
import AdminPage from './containers/AdminPage'

export default (
    <Route component={App} >
        <Route path="/admin" component={AdminPage}>
            <Route path=":login/:name"
                   component={RepoPage}/>
            <Route path=":login"
                   component={UserPage}/>
        </Route>
        <Route path="*" component={NotFoundPage} status={404}/>
    </Route>
)

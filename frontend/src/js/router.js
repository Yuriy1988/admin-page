import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'

import App from './components/app'
import Pay from './components/pay'

render((
  <Router history={hashHistory} >
    <Route path="/" component={App}>
    	<Route path="/pay" component={Pay} />
    </Route>
  </Router>
), document.querySelector('.wrapper'))
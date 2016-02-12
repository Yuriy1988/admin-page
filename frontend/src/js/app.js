import React from 'react'
import { render } from 'react-dom'
import {browserHistory, Router, Route, Link, Redirect, IndexRoute} from 'react-router'

import Header from './components/header'
import Footer from './components/footer'
import Sidebar from './components/sidebar'
import Content from './components/content'
import AddMerchant from './components/merchants/merchant_registration'
import MerchantDetails from './components/merchants/merchant_detail'
import PayList from './components/paymentSystems/payList'
import AddAdmin from './components/admin/addAdmin'

const App = React.createClass({
  getInitialState() {
      return {
          isLoged: true,
      };
  },
  render() {
    return (
      <div className="components">
        <Header isLoged={this.state.isLoged}/>
        <Sidebar />
        <div className="content-wrapper">
            {this.props.children}
        </div>
        <Footer isLoged={this.state.isLoged}/>
      </div>
    )
  }
})

render((
  <Router history={browserHistory}>
    <Route path="/admin/" component={App}>
      <IndexRoute component={Content} />
      <Route path="merchant/add" component={AddMerchant} />
      <Route path="merchant/:merchantID" component={MerchantDetails} />
      <Route path="paysys/" component={PayList} />
      <Route path="admins/add" component={AddAdmin} />
    </Route>
  </Router>),
   document.getElementById('app'));
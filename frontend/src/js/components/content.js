import React from 'react'
import { Link } from 'react-router';
import Login from './login'
import AddMerchant from './merchants_components/merchant_registration'
import MerchantDetail from './merchants_components/merchant_detail'
import MerchantAddWebsite from './merchants_components/merchant_add_website'

const Content = React.createClass({
  render() {
  	var showContent = this.props.loged? <AddMerchant /> : <Login />;
    return (
    	<Login />
    )
  }
})

export default Content
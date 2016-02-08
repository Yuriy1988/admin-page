import React from 'react'

import Login from './login'
import AddMerchant from './merchants/merchant_registration'
import MerchantDetail from './merchants/merchant_detail'
import MerchantAddWebsite from './merchants/merchant_add_website'
import AddAdmin from './admin/addAdmin.js'

const Content = React.createClass({
  render() {
  	var showContent = this.props.loged? <AddMerchant /> : <Login />;
    return (
    	<section className="content">
    		<AddMerchant />
    	</section>
    )
  }
})

export default Content
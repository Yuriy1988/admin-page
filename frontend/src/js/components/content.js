import React from 'react'

import Login from './login'
import AddMerchant from './merchants/merchant_registration'
import MerchantDetail from './merchants/merchant_detail'
import MerchantAddWebsite from './merchants/merchant_add_website'
import AddAdmin from './admin/addAdmin.js'

const Content = React.createClass({
  render() {
    return (
    	<section className="content">
    		{this.props.children}
    	</section>
    )
  }
})

export default Content
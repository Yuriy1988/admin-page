import React from 'react';
import MerchantUser from './merchant_user'; 
import MerchantSites from './merchant_websites';

let fakeID = 0;
const MerchantDetail = React.createClass({
  render() {
    return (
      <div className="row">
                <div className="col-xs-12">
                    <div className="nav-tabs-custom">
                <ul className="nav nav-tabs pull-right">
                  <li>
                      <a href="#/merchant/1/users">Users</a>
                  </li>
                  <li className="active">
                      <a href="#/merchant/1/sites">Web Sites</a>
                  </li>
                  <li className="pull-left header">
                      <i className="fa "></i>
                      {'User № ' + ++fakeID}
                  </li>
                <li className="dropdown pull-left">{/*add open class for dropdown list*/}
                    <a className="dropdown-toggle cursor-pointer">
                       <span>Actions</span>
                       <span className="caret"></span>
                    </a>
                <ul className="dropdown-menu">
                  <li role="presentation"><a href="#/merchant/1/addSite">Add Web Site</a></li>
                  <li role="presentation"><a href="#/merchant/1/add">Add User</a></li>
                  <li role="presentation"><a href="#/merchant/1/edit">Modify</a></li>
                  <li role="presentation"><a className="text-red cursor-pointer" >Delete</a></li>
                </ul>
              </li>
            </ul>
            <div className="tab-content no-padding">
            {/*here user or websites*/}
            <MerchantSites />
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default MerchantDetail

//34 <!-- uiView:  -->
//52                       <!-- ngIf: site.setting.logo -->
//57<!--a ui-sref="merchant.statSite({merchantId: merchantId, siteId: id})" class="btn btn-warning btn-xs">Статистика</a-->
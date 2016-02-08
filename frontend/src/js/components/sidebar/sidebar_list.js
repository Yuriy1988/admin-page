import React from 'react'

const SidebarList = React.createClass({
  render() {
    return (
	            <ul className="sidebar-menu">
	               <li className="treeview active">{/*add class active if merchant tab open*/}
	                 	 <a href="#">
	                     <i className="fa fa-suitcase"></i>
	                     <span>Merchants</span>
	                     <i className="fa fa-angle-left pull-right"></i>
	                  </a>
	                  <ul className="treeview-menu ">{/*add class menu-open if merchant tab open*/}
	                     <li>
	                        <a href="#/merchants/add">
	                           <i className="fa fa-plus-circle text-green"></i>
	                           <span>Add</span>
	                        </a>
	                     </li>
	                    <li>
	                        <a href="#/merchant/1/sites">
	                           <i className="fa"><b>1) </b></i>
	                           <span>test1</span>
	                        </a>
	                     </li>
	                     <li>
	                        <a href="#/merchant/35/sites">
	                           <i className="fa"><b>2) </b></i>
	                           <span>hello world</span>
	                        </a>
	                     </li>
	                  </ul>
	                </li>
	                <li>
	                    <a href="#/pay">
	                        <i className="fa fa-credit-card"></i>
	                        <span>Payment Systems</span>
	                    </a>
	                </li>
	                <li className="treeview">
	                  <a href="#">
	                     <i className="fa fa-user-secret"></i>
	                     <span>Administrators</span>
	                     <i className="fa fa-angle-left pull-right"></i>
	                  </a>
	                  <ul className="treeview-menu">
	                     <li>
	                        <a href="#/admins/add">
	                           <i className="fa fa-plus-circle text-green"></i>
	                           <span>Add</span>
	                        </a>
	                     </li>
	                  </ul>
	                </li>
	                <li className="treeview">
	                    <a href="#/money">
	                        <i className="fa fa-money"></i>
	                        <span>Currency Courses</span> 
	                    </a>	                   
	                </li>
	            </ul>
    )
  }
})

export default SidebarList

// 66: <!--i className="fa fa-angle-left pull-right"></i-->
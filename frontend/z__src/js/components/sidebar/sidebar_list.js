import React from 'react'
import { Link } from 'react-router'

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
	                        <Link to="/admin/merchant/add">
	                           <i className="fa fa-plus-circle text-green"></i>
	                           <span>Add</span>
	                        </Link>
	                     </li>
	                    <li>
	                        <Link to="/admin/merchant/1">
	                           <i className="fa"><b>1) </b></i>
	                           <span>test1</span>
	                        </Link>
	                     </li>
	                     <li>
	                        <Link to="/admin/merchant/2">
	                           <i className="fa"><b>2) </b></i>
	                           <span>hello world</span>
	                        </Link>
	                     </li>
	                  </ul>
	                </li>
	                <li>
	                    <Link to="/admin/paysys/">
	                        <i className="fa fa-credit-card"></i>
	                        <span>Payment Systems</span>
	                    </Link>
	                </li>
	                <li className="treeview active">
	                  <a href="#">
	                     <i className="fa fa-user-secret"></i>
	                     <span>Administrators</span>
	                     <i className="fa fa-angle-left pull-right"></i>
	                  </a>
	                  <ul className="treeview-menu">
	                     <li>
	                        <Link to="/admin/admins/add/">
	                           <i className="fa fa-plus-circle text-green"></i>
	                           <span>Add</span>
	                        </Link>
	                     </li>
	                  </ul>
	                </li>
	                <li className="treeview">
	                    <Link to="/money">
	                        <i className="fa fa-money"></i>
	                        <span>Currency Courses</span> 
	                    </Link>	                   
	                </li>
	            </ul>
    )
  }
})

export default SidebarList

// 66: <!--i className="fa fa-angle-left pull-right"></i-->
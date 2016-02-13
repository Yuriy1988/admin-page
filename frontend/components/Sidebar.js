import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class Sidebar extends Component {

    render() {
        return (
            <aside className="main-sidebar">
                <section className="sidebar">
                    <ul className="sidebar-menu">
                        <li className="treeview active">
                            <a href="#">
                                <i className="fa fa-suitcase"/>
                                <span>Merchants</span>
                                <i className="fa fa-angle-left pull-right"/>
                            </a>
                            <ul className="treeview-menu ">
                                <li>
                                    <Link to="/admin/merchant/add">
                                        <i className="fa fa-plus-circle text-green"/>
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
                                <i className="fa fa-credit-card"/>
                                <span>Payment Systems</span>
                            </Link>
                        </li>
                        <li className="treeview active">
                            <a href="#">
                                <i className="fa fa-user-secret"/>
                                <span>Administrators</span>
                                <i className="fa fa-angle-left pull-right"/>
                            </a>
                            <ul className="treeview-menu">
                                <li>
                                    <Link to="/admin/admins/add/">
                                        <i className="fa fa-plus-circle text-green"/>
                                        <span>Add</span>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="treeview">
                            <Link to="/money">
                                <i className="fa fa-money"/>
                                <span>Currency Courses</span>
                            </Link>
                        </li>
                    </ul>
                </section>
            </aside>
        );
    }
}
Sidebar.propTypes = {};


/* < */
/*
 <!--i className="fa fa-angle-left pull-right"></i-->*/
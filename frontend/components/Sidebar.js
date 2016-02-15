import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import * as SideBarAction from '../actions/sideBar'
import SidebarItem from '../components/SidebarItem'

class Sidebar extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        const {enableSideBar} = this.props;
        enableSideBar();
    }

    componentWillUnmount() {
        const {disableSideBar} = this.props;
        disableSideBar();
    }

    render() {

        const {enable} = this.props.sideBar;

        if (!enable) {
            return null;
        }

        return (
            <aside className="main-sidebar">
                <section className="sidebar">
                    <ul className="sidebar-menu">

                        <SidebarItem item={{icon:"fa-suitcase", children:"Merchants"}}
                                     subItems={[
                                         {to:"/admin/admins/add", icon:"fa-plus-circle text-green", children:"Add"},
                                         {to:"/admin/merchant/1", children:"test1"},
                                         {to:"/admin/merchant/2", children:"test2"},
                                         {to:"/admin/merchant/3", children:"test3"}
                                     ]}/>
                        <SidebarItem item={{to:"/admin/paysys",icon:"fa-credit-card",children:"Payment Systems"}}/>
                        <SidebarItem item={{icon:"fa-user-secret",children:"Administrators"}}
                                     subItems={[
                                         {to:"/admin/admins/add",icon:"fa-plus-circle text-green",children:"Add"}
                                     ]}/>

                        <SidebarItem item={{to:"/admin/money",icon:"fa-money",children:"Currency Courses"}}/>

                    </ul>
                </section>
            </aside>
        );
    }
}


export default connect((store)=> {
    return {
        sideBar: store.sideBar
    }
}, {
    enableSideBar: SideBarAction.enable,
    disableSideBar: SideBarAction.disable
})(Sidebar);
/* < */
/*
 <!--i className="fa fa-angle-left pull-right"></i-->*/
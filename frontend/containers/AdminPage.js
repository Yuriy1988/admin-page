import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Sidebar from '../components/Sidebar'
import Content from '../components/Content'
import { SidebarItem, SidebarContainer } from '../components/SidebarItem'
import AdminIndex from '../containers/pages/AdminIndex'
import Transition from '../containers/Transition'


class AdminPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { children } = this.props;

        const path = location.pathname.split("/").slice(0, 6).join("/");

        return (
            <div>
                <Sidebar >
                    <SidebarContainer icon="fa-suitcase" title="Merchants">
                        <SidebarItem to="/admin/administrator/merchants/add"
                                     icon="fa-plus-circle text-green">Add</SidebarItem>
                        <SidebarItem to="/admin/administrator/merchants/list" icon="fa-list">List</SidebarItem>
                    </SidebarContainer>
                    <SidebarItem to="/admin/administrator/paysys" icon="fa-credit-card">Payment Systems</SidebarItem>
                    <SidebarItem to="/admin/administrator/notifications" icon="fa-bell">Notifications</SidebarItem>
                    <SidebarItem to="/admin/administrator/currencies" icon="fa-money">Currency Courses</SidebarItem>
                    <SidebarItem to="/admin/administrator/statistic" icon="fa-pie-chart ">Statistics</SidebarItem>
                    <SidebarItem to="/admin/administrator/antifraud" icon="fa fa-cogs ">Anti-fraud</SidebarItem>
                </Sidebar>
                <Content>
                    <Transition path={path}>
                        { children || <AdminIndex /> }
                    </Transition>
                </Content>
            </div>
        )
    }
}


export default connect((state)=> {
    return {sideBar: state.sideBar}
})(AdminPage)

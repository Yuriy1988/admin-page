import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Sidebar from '../components/Sidebar'
import {SidebarItem, SidebarContainer} from '../components/SidebarItem'


class AdminPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { children } = this.props;

        return (
            <div>
                <Sidebar >

                    <SidebarContainer icon="fa-suitcase" title="Merchants">
                        <SidebarItem to="/admin/admins/add" icon="fa-plus-circle text-green">Add</SidebarItem>
                        <SidebarItem to="/admin/merchant/1" >Test 1</SidebarItem>
                        <SidebarItem to="/admin/merchant/2" >Test 2</SidebarItem>
                        <SidebarItem to="/admin/merchant/3" >Test 3</SidebarItem>
                    </SidebarContainer>

                    <SidebarItem to="/admin/paysys" icon="fa-credit-card">Payment Systems</SidebarItem>

                    <SidebarContainer icon="fa-user-secret" title="Administrators">
                        <SidebarItem to="/admin/admins/add" icon="fa-plus-circle text-green">Add</SidebarItem>
                        <SidebarItem to="/admin/admins/add" icon="fa-plus-circle text-green">Add</SidebarItem>
                    </SidebarContainer>

                    <SidebarItem to="/admin/money" icon="fa-money">Currency Courses</SidebarItem>


                </Sidebar>
                <h1>It is admin page</h1>
                {children}
            </div>
        )
    }
}


export default connect((state)=> {
    return {sideBar: state.sideBar}
})(AdminPage)

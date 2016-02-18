import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Sidebar from '../components/Sidebar'
import Content from '../components/Content'
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

                    {/*<SidebarContainer icon="fa-suitcase" title="Merchants">
                        <SidebarItem to="/admin/admins/add" icon="fa-plus-circle text-green">Add</SidebarItem>
                        <SidebarItem to="/admin/merchant/1">Test 1</SidebarItem>
                        <SidebarItem to="/admin/merchant/2">Test 2</SidebarItem>
                        <SidebarItem to="/admin/merchant/3">Test 3</SidebarItem>
                    </SidebarContainer>*/}

                    <SidebarContainer icon="fa-suitcase" title="Merchants">
                        <SidebarItem to="/admin/administrator/merchants/add" icon="fa-plus-circle text-green">Add</SidebarItem>
                        <SidebarItem to="/admin/administrator/merchants/list" icon="fa-list">List</SidebarItem>
                    </SidebarContainer>

                    <SidebarItem to="/admin/administrator/paysys" icon="fa-credit-card">Payment Systems</SidebarItem>

                    {/*<SidebarContainer icon="fa-user-secret" title="Administrators">
                        <SidebarItem to="/admin/admins/add" icon="fa-plus-circle text-green">Add</SidebarItem>
                        <SidebarItem to="/admin/admins/add" icon="fa-plus-circle text-green">Add</SidebarItem>
                    </SidebarContainer>*/}

                    <SidebarItem to="/admin/administrator/notice" icon="fa-bell">Notice</SidebarItem>
                    <SidebarItem to="/admin/administrator/money" icon="fa-money">Currency Courses</SidebarItem>


                </Sidebar>
                <Content>
                    {/*<div className="box">
                        <div className="box-header">
                            <h1 className="box-title">XOPay Administartor</h1>
                        </div>
                    </div>*/}
                    {children}
                </Content>
            </div>
        )
    }
}


export default connect((state)=> {
    return {sideBar: state.sideBar}
})(AdminPage)

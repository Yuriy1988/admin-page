import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Sidebar from '../../components/Sidebar'
import {SidebarItem, SidebarContainer} from '../../components/SidebarItem'


class NotificationsPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { children } = this.props;

        return (
            <div>

                <div className="box">
                    <div className="box-header">
                        <h2 className="box-title">Notifications</h2>
                    </div>
                </div>
                {children}
            </div>
        )
    }
}


export default connect((state)=> {
    return {notifications: state.notifications}
})(NotificationsPage)

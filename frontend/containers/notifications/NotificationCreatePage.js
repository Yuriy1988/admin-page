import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { NotificationsActions } from '../../actions/index'

import NotificationForm from './NotificationForm'
import LoadingOverlay from '../../components/LoadingOverlay'
//import Alert, { TYPE_ERROR } from '../../components/Alert'

class NotificationCreatePage extends Component {

    constructor(props) {
        super(props);
        this.onCreate = this.onCreate.bind(this);
    }

    onCreate(notification) {
        const { addNotification } = this.props;
        addNotification(notification);
    }

    render() {
        debugger;
        const selectedNotification = this.props.selectedNotification;
        return (
            <div>
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">Create Notification</h3>
                    </div>
                    <div className="box-body">
                        <NotificationForm onCreate={this.onCreate} selectedNotification={selectedNotification}/>
                    </div>
                    {/*<LoadingOverlay loading={createRequest.isFetching}/>*/}
                </div>
            </div>
        )
    }
}



export default connect(
    (state)=>({
        selectedNotification: state.notifications.selectedNotification
    }),
    {
        addNotification: NotificationsActions.addNotification
    }
)(NotificationCreatePage)

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { NotificationsActions } from '../../actions/index'

import NotificationForm from './NotificationForm'
import LoadingOverlay from '../../components/LoadingOverlay'

class NotificationEditPage extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const id = location.pathname.split('/')[4];
        this.props.getNotificationById(id)
    }

    onEdit(notification) {
        const { editNotification } = this.props;
        editNotification(notification);
    }

    render() {
        const selectedNotification = this.props.selectedNotification;

        return (
            <div>
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">Edit Notification</h3>
                    </div>
                    <div className="box-body">
                        <NotificationForm onCreate={this.onEdit} selectedNotification={selectedNotification}/>
                        <LoadingOverlay loading={selectedNotification.isFetching}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    (state)=>({
        selectedNotification: state.notification
    }),
    {
        editNotification: NotificationsActions.editNotification,
        getNotificationById: NotificationsActions.getNotificationById
    }
)(NotificationEditPage)

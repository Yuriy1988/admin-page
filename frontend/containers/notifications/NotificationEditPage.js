import React, {Component} from 'react'
import {connect} from 'react-redux'

import {NotificationsActions} from '../../actions/index'

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

    componentWillUnmount() {
       this.props.clearNotification();
    }

    onEdit(notification) {
        const {editNotification, selectedNotification} = this.props;
        editNotification(Object.assign({}, notification, {id: selectedNotification.id}), selectedNotification.id);
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
                        <NotificationForm onSubmit={this.onEdit.bind(this)}
                                          selectedNotification={selectedNotification}/>
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
        getNotificationById: NotificationsActions.getNotificationById,
        clearNotification: NotificationsActions.clearNotification
    }
)(NotificationEditPage)

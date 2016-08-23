//TODO refactor
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Alert, {TYPE_ERROR} from '../../components/Alert'
import {Link} from 'react-router'
import * as NotificationActions from '../../actions/notifications';
import LoadingOverlay from '../../components/LoadingOverlay';

class NotificationPage extends Component {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this.props.clearNotifications();
    }

    componentWillMount() {
        const id = this.props.params.notificationId;
        this.props.getNotificationById(id);
    }

    handleDeleteButton(nonify_id) {
        const {deleteNotification} = this.props;
        deleteNotification(nonify_id);
    }


    render() {
        const {notification, notifications}  = this.props;
        return ( notification.name ?
                <div className="row">

                    <div className="col-sm-6">
                        <div className="box with-border box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">Notification info</h3>
                                <button className="btn btn-success small-margin pull-right">Edit</button>
                                <button
                                    onClick={this.handleDeleteButton.bind(this, notification.id)}
                                    className="btn btn-warning small-margin pull-right">Delete</button>
                            </div>
                            <div className="box-body">
                                <ul className="list-group list-group-unbordered">
                                    <li className="list-group-item">
                                        <b>Notification Name</b> <span
                                        className="pull-right">{notification.name}</span>
                                    </li>

                                    <li className="list-group-item">
                                        <b>Body template</b>
                                        <div>{notification.bodyTemplate}</div>
                                    </li>

                                    <li className="list-group-item">
                                        <b>Case Regex</b><span
                                        className="pull-right">{notification.caseRegex}</span>
                                    </li>

                                    <li className="list-group-item">
                                        <b>Case Template</b><span
                                        className="pull-right">{notification.caseTemplate}</span>
                                    </li>

                                    <li className="list-group-item">
                                        <b>Header Template</b><span
                                        className="pull-right">{notification.headerTemplate}</span>
                                    </li>

                                    <li className="list-group-item">
                                        <b>Id</b><span
                                        className="pull-right">{notification.id}</span>
                                    </li>

                                    <li className="list-group-item">
                                        <b>Subscribers Template</b><span
                                        className="pull-right">{notification.subscribersTemplate}</span>
                                    </li>

                                </ul>

                            </div>
                        </div>
                    </div>
                </div> : <div>
                <div className="col-sm-3 small-margin"><Alert type={TYPE_ERROR}>
                    {notifications.error}
                </Alert></div>
                <LoadingOverlay loading={notifications.isFetching}/></div>
        )
    }
}

export default connect(
    (state)=>({
        notification: state.notifications.selectedNotification,
        notifications: state.notifications
    }),
    {
        getNotificationById: NotificationActions.getNotificationById,
        deleteNotification: NotificationActions.deleteNotification,
        clearNotifications: NotificationActions.clearNotifications
    }
)(NotificationPage)


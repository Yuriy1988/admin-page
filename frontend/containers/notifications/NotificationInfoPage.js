//TODO refactor
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Alert, {TYPE_ERROR} from '../../components/Alert'
import {Link} from 'react-router'
import * as NotificationActions from '../../actions/notifications';
import LoadingOverlay from '../../components/LoadingOverlay';
import Transition from '../../containers/Transition';

class NotificationPage extends Component {
    constructor(props) {
        super(props);
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
        const {notification, notifications, getNotificationById}  = this.props;
        return ( notification.name ?
                <div className="row">

                    <div className="col-sm-6">
                        <div className="box with-border box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">Notification info</h3>
                                <div className="btn-toolbar pull-right">
                                <Link onClick={()=> {
                                    getNotificationById(notification.id)
                                }}
                                      className="btn btn-sm btn-primary"
                                      to={`/admin/administrator/notifications/${notification.id}/edit`}>
                                    <i className="fa fa-edit"/> Edit
                                </Link>


                                <span className="btn btn-sm btn-danger"
                                      onClick={this.handleDeleteButton.bind(this, notification.id)}>
                                <i className="fa fa-trash"/> Delete
                            </span>
                                    </div>


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
        notification: state.notification,
        notifications: state.notifications
    }),
    {
        getNotificationById: NotificationActions.getNotificationById,
        deleteNotification: NotificationActions.deleteNotification,
        clearNotifications: NotificationActions.clearNotifications
    }
)(NotificationPage)


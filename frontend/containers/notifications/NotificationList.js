import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import Alert, {TYPE_ERROR} from '../../components/Alert'
import * as NotificationActions from '../../actions/notifications';
import LoadingOverlay from '../../components/LoadingOverlay';


class NotificationList extends Component {
    constructor(props) {
        super(props);
    }

    handleDeleteButton(nonify_id) {
        const {deleteNotification} = this.props;
        if (confirm("Are you sure you want to delete notification?")) {
            deleteNotification(nonify_id);
        }
    }

    componentWillMount() {
        this.props.getNotifications();
    }

    componentWillUnmount() {
        this.props.clearNotifications();
    }

    render() {
        let {notifications} = this.props;
        const list = notifications.notifications;

        const content = notifications.notifications.map((notification, i) => {
            return (
                <table className="table table-hover table-striped">
                    <tbody>
                    <tr key="header">
                        <th width="5%">#</th>
                        <th>Name</th>
                        <th width="145px">Actions</th>
                    </tr>
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                            <Link to={`/admin/administrator/notifications/${list[i].id}`}>
                                {list[i].name}
                            </Link>
                        </td>
                        <td>
                            <div className="btn-toolbar pull-right">
                                <Link className="btn btn-sm btn-primary"
                                      to={`/admin/administrator/notifications/${list[i].id}/edit`}>
                                    <i className="fa fa-edit"/> Edit
                                </Link>
                                <span className="btn btn-sm btn-danger"
                                      onClick={this.handleDeleteButton.bind(this, list[i].id)}>
                                <i className="fa fa-trash"/> Delete
                            </span>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            )
        });

        return !notifications.isFetching ? <div>
            <div className="box">
                <div className="box-header with-border">
                    <h3 className="box-title"><i className="fa fa-briefcase"/> Notifications</h3>
                    <div className="box-tools pull-right">
                        <Link className="btn btn-sm btn-success" to="/admin/administrator/notifications/add"><i
                            className="fa fa-plus"/> Add</Link>
                    </div>
                </div>
                <div className="box-body no-padding">
                    <div className="table-responsive">
                        {content}
                    </div>
                </div>
                <div className="col-sm-3 small-margin">
                    <Alert type={TYPE_ERROR}>
                        {notifications.error}
                    </Alert>
                </div>
            </div>
        </div> : <LoadingOverlay loading={notifications.isFetching }/>

    }
}

export default connect(
    (state)=>({
        notifications: state.notifications
    }),
    {
        getNotifications: NotificationActions.getNotifications,
        clearNotifications: NotificationActions.clearNotifications,
        deleteNotification: NotificationActions.deleteNotification
    }
)(NotificationList);


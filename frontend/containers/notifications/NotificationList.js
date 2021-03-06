import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import Alert, {TYPE_ERROR, TYPE_INFO} from '../../components/Alert'
import * as NotificationActions from '../../actions/notifications';
import LoadingOverlay from '../../components/LoadingOverlay';


class NotificationList extends Component {
    constructor(props) {
        super(props);
        this.message = <div className="message"><Alert type={TYPE_INFO}>
            {this.props.message}
        </Alert></div>
    }

    handleDeleteButton(nonify_id) {
        const {deleteNotification} = this.props;
        deleteNotification(nonify_id);
    }

    componentWillMount() {
        this.props.getNotifications();
    }

    componentWillUnmount() {
        this.props.clearNotifications();
    }


    render() {

        let {notifications, message} = this.props;
        let {getNotificationById} = this.props;
        const list = notifications.notifications;

        const content = list.map((notification, i) => {
            return (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                        <Link onClick={()=> {
                            getNotificationById(list[i].id)
                        }}
                              to={`/admin/administrator/notifications/${list[i].id}`}>
                            {list[i].name}
                        </Link>
                    </td>
                    <td key={Math.random()}>
                        <div className="btn-toolbar pull-right">
                            <Link onClick={()=> {
                                getNotificationById(list[i].id)
                            }}
                                  className="btn btn-sm btn-primary"
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
            )
        });

        return <div>
            <div className="box">
                <div className="box-header with-border">
                    <h3 className="box-title"><i className="fa fa-briefcase"/> Notifications</h3>
                    <div className="box-tools pull-right">
                        <Link className="btn btn-sm btn-success" to="/admin/administrator/notifications/add"><i
                            className="fa fa-plus"/> Add</Link>
                    </div>
                </div>
                {this.message}
                <div className="box-body no-padding">
                    <div className="table-responsive">
                        <table className="table table-hover table-striped">
                            <tbody>
                            <tr key="header">
                                <th width="5%">#</th>
                                <th>Name</th>
                                <th width="145px">Actions</th>
                            </tr>
                            {content}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-sm-3 small-margin">
                    <Alert type={TYPE_ERROR}>
                        {this.props.notifications.error}
                    </Alert>
                </div>
                <LoadingOverlay loading={notifications.isFetching }/>
            </div>

        </div>

    }
}

export default connect(
    (state)=>({
        notifications: state.notifications,
        message: state.notifications.message
    }),
    {
        getNotificationById: NotificationActions.getNotificationById,
        getNotifications: NotificationActions.getNotifications,
        clearNotifications: NotificationActions.clearNotifications,
        deleteNotification: NotificationActions.deleteNotification
    }
)(NotificationList);


//TODO refactor
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import {MerchantActions} from '../../actions/index';
import * as NotificationActions from '../../actions/notifications';
import Alert, {TYPE_ERROR} from '../../components/Alert';
import LoadingOverlay from '../../components/LoadingOverlay';

import Transition from '../../containers/Transition';

class NotificationList extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.getNotifications();
    }


    handleClick(e) {
        // e.preventDefault();
    }

    render() {
        this.props.notifications;
        const {notifications, children} = this.props;
        debugger;


        return <div>
                <h1 className="page-header">
                    <i className="fa fa-briefcase"/> {notifications[0].name}
                </h1>
                <Transition>{children}</Transition>
            </div>
    }
}


export default connect(
    (state)=>({
        notifications: state.notifications.notifications
    }),
    {
        getNotifications: NotificationActions.getNotifications,
    }
)(NotificationList);


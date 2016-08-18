//TODO refactor
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import {MerchantActions} from '../../actions/index';
import * as NotificationActions from '../../actions/notifications';
import Alert, {TYPE_ERROR} from '../../components/Alert';
import LoadingOverlay from '../../components/LoadingOverlay';
import Notifications from './notifications'
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

        const {notifications, children} = this.props;
        return !notifications.length? <div>
                <h1 className="page-header">
                    <i className="fa fa-briefcase"/>
                    <ul>
                    <Notifications notifications ={notifications}/>
                    </ul>
                </h1>
                <Transition>{children}</Transition>
            </div>:  <LoadingOverlay loading={notifications.isFetching }/>
    }
}

export default connect(
    (state)=>({
        notifications: state.notifications
    }),
    {
        getNotifications: NotificationActions.getNotifications,
    }
)(NotificationList);


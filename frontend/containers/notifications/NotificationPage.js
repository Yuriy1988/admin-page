//TODO refactor
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import * as NotificationActions from '../../actions/notifications';
import LoadingOverlay from '../../components/LoadingOverlay';

class NotificationPage extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const id = this.props.params.notificationId;
        this.props.getNotificationById(id);
    }

    render() {
      return <div> HEY YOU</div>
    }
}

export default connect(
    (state)=>({

    }),
    {
        getNotificationById: NotificationActions.getNotificationById,
    }
)(NotificationPage)

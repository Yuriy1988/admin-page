//TODO refactor
import React, {Component, PropTypes} from 'react'

class Notifications extends Component {
    constructor(props) {
        super(props);
    }

    handleClick(e) {
        // e.preventDefault();
    }

    render() {
        //
        const {notifications} = this.props;
        console.log(this.props);
        return <ul>
            {notifications.notifications.map(function (result, i) {
                return <li key={i}>{result.name}</li>;
            })}
        </ul>


    }
}

export default Notifications;

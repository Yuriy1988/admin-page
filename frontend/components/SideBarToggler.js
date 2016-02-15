import React, { Component, PropTypes } from 'react'
import {connect} from 'react-redux'
import * as Actions from '../actions/sideBar'


class SideBarToggler extends Component {
    render() {
        const {toggle, sideBar:{enable}} = this.props;
        if (!enable) return null;
        return (
            <a onClick={toggle} className="sidebar-toggle">
                <span className="sr-only">Toggle navigation</span>
            </a>
        )
    }
}

export default connect((state)=> {
    return {sideBar: state.sideBar}
}, {
    toggle: Actions.toggle
})
(SideBarToggler);
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'


class SideBarProvider extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const { children, sideBar:{display,enable} } = this.props;

        return (
            <div className={((enable)?" sidebar-mini ":"")+((enable && !display)?" sidebar-collapse sidebar-open ":"")}>
                {children}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sideBar: state.sideBar
    }
}

export default connect(mapStateToProps)(SideBarProvider)

import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import * as SideBarAction from '../actions/sideBar'

class Sidebar extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        const {enableSideBar} = this.props;
        enableSideBar();
    }

    componentWillUnmount() {
        const {disableSideBar} = this.props;
        disableSideBar();
    }

    render() {

        const {sideBar:{enable},children} = this.props;

        if (!enable) {
            return null;
        }

        return (
            <aside className="main-sidebar">
                <section className="sidebar">
                    <ul className="sidebar-menu">
                        {children}
                    </ul>
                </section>
            </aside>
        );
    }
}


export default connect((store)=> {
    return {
        sideBar: store.sideBar
    }
}, {
    enableSideBar: SideBarAction.enable,
    disableSideBar: SideBarAction.disable
})(Sidebar);
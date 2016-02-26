import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Sidebar from '../../components/Sidebar'
import {SidebarItem, SidebarContainer} from '../../components/SidebarItem'


class Merchants extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { children } = this.props;

        return (
            <div>
                <h1 className="page-header">Merchants</h1>
                {children}
            </div>
        )
    }
}


export default connect((state)=> {
    return {merchants: state.merchants}
})(Merchants)

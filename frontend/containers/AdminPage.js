import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Sidebar from '../components/Sidebar'


class AdminPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { children } = this.props;

        return (
            <div>
                <Sidebar />
                <h1>It is admin page</h1>
                {children}
            </div>
        )
    }
}


export default connect((state)=> {
    return {sideBar: state.sideBar}
})(AdminPage)

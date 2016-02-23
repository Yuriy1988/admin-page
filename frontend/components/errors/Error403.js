import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'


class Error403 extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="box box-danger">
                <div className="box-header ">
                    <h1 className="box-title box-warning">Error 403. Access denied</h1>
                </div>
                <div className="box-body">
                    <p>
                        You don't have permissions to access this page. Please
                        &nbsp;<Link to="/admin/login" className="btn btn-warning btn-xs">sign in</Link>&nbsp;
                        with user that has {} role
                    </p>
                </div>
            </div>

        )
    }
}


export default Error403

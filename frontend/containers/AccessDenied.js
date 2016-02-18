import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'


class AccessDenied extends Component {
    constructor(props) {
        super(props);
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        }
    };

    render() {

        const {router} = this.context;

        return (

            <div className="box box-danger">
                <div className="box-header ">
                    <h1 className="box-title box-warning">Error 403. Access denied</h1>
                </div>
                <div className="box-body">
                    <p>
                        You don't have permissions to access this page. Please <Link to="/admin/login" className="btn btn-warning btn-xs">sign in</Link> with user that has {} role
                    </p>
                </div>
            </div>


        )
    }
}


export default connect()(AccessDenied)

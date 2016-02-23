import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'


class Error404 extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="box box-danger">
                <div className="box-header ">
                    <h1 className="box-title box-warning">Error 404. Page not found <b
                        className="text-red">{location.pathname}</b></h1>
                </div>
                <div className="box-body">
                    <Link to="/admin" className="btn btn-warning"><i className="fa fa-home"/></Link>
                    <p>
                        The 404 or Not Found error message is an HTTP standard response code indicating that the
                        client was able to communicate with a given server,
                        but the server could not find what was requested.
                    </p>
                    <p>

                        The web site hosting server will typically generate a "404 Not Found" web page when
                        a user attempts to follow a broken or dead link; hence the 404 error is one
                        of the most recognizable errors encountered on the World Wide Web.
                    </p>
                </div>
            </div>
        )
    }
}


export default Error404

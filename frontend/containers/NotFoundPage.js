import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'


class NotFoundPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>404 Page not found!</h1>
            </div>
        )
    }
}


export default connect()(NotFoundPage)

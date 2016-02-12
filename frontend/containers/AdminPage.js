import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'


class NotFoundPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { children } = this.props;

        return (
            <div>
                <h1>It is admin page</h1>
                {children}
            </div>
        )
    }
}


export default connect()(NotFoundPage)

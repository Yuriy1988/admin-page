import React, { Component } from 'react'

export default class LoadingOverlay extends Component {
    render() {
        const { loading = true } = this.props;
        return (loading) ? (
            <div className="overlay">
                <i className="fa fa-refresh fa-spin"/>
            </div>
        ) : null
    }
}


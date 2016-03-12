import React, { Component } from 'react'


export default class Boolean extends Component {

    static renderContent(value) {
        switch (value) {
            case true:
                return <i className="fa fa-check text-green"/>;
                break;
            case false:
                return <i className="fa fa-times text-red"/>;
                break;
            default:
                return null;
        }
    }

    render() {
        const { value } = this.props;

        return (
            <div {...this.props} >
                {Boolean.renderContent(value)}
            </div>
        );
    }
}

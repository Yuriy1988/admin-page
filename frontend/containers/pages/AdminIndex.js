import React, { Component } from 'react'

export default class AdminIndex extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                <h1 className="page-header">XOPay Administrator panel</h1>
                <h4><i className="fa fa-money" /> Welcome</h4>
            </div>
        )
    }
}

import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import PasswordCreateForm from '../components/PasswordCreateForm'
import Content from '../components/Content'

class PasswordCreatePage extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        document.body.className = "hold-transition login-page";
    }

    componentWillUnmount() {
        document.body.className = "skin-green-light";
    }

    render() {
        const {children} = this.props;

        return (
            <div className="hold-transition login-page">
                <div className="login-box">  {/* <body className="hold-transition login-page">*/}
                    <div className="login-logo">
                        <a href="../../index2.html"><b>XOP</b>ay</a>
                    </div>
                    <div className="login-box-body">
                        <p className="login-box-msg">Sign in to administrator panel</p>
                        <PasswordCreateForm />
                    </div>
                </div>
            </div>
        )
    }
}


export default connect()(PasswordCreatePage)

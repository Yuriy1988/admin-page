import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import PasswordRecoveryForm from '../components/PasswordRecoveryForm'


class PasswordRecoveryPage extends Component {
    componentWillMount() {
        document.body.className = "hold-transition login-page";
    }

    render() {
        return (

            <div className="hold-transition login-page">
                <div className="login-box">  {/* <body className="hold-transition login-page">*/}
                    <div className="login-logo">
                        <b>XOP</b><span>ay</span>
                    </div>
                    <div className="login-box-body">
                        <p className="login-box-msg">Enter your login name. You will receive latter on your e-mail to recover your password  </p>
                        <PasswordRecoveryForm />
                    </div>
                </div>
            </div>
        )
    }
}


export default connect()(PasswordRecoveryPage)

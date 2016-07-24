import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import PasswordRecoveryForm from '../components/PasswordRecoveryForm'


class PasswordRecoveryPage extends Component {
    constructor(props) {
        super(props);
    }


    componentWillMount() {
        document.body.className = "hold-transition login-page";
    }

    componentWillUnmount() {
        // document.body.className = "skin-green-light";
    }

    render() {
        const {children} = this.props;

        return (

            <div className="hold-transition login-page">
                <div className="login-box">
                    <div className="login-logo">
                        <b>XOP</b><span>ay</span>
                    </div>
                    <div className="login-box-body">
                        <p className="login-box-msg">Enter your e-mail</p>
                        <PasswordRecoveryForm />
                    </div>
                </div>
            </div>
        )
    }
}


export default connect()(PasswordRecoveryPage)

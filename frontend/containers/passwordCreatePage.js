import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import PasswordCreateForm from '../components/PasswordCreateForm'


class PasswordCreatePage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let token = window.location.search;
        window.localStorage.setItem('user_token', token.substring(7, token.length-1));
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
                <div className="login-box">  {/* <body className="hold-transition login-page">*/}
                    <div className="login-logo">
                        <b>XOP</b><span>ay</span>
                    </div>
                    <div className="login-box-body">
                        <p className="login-box-msg">Create your password here. It must contain at least 8 characters</p>
                        <PasswordCreateForm />
                    </div>
                </div>
            </div>
        )
    }
}


export default connect()(PasswordCreatePage)

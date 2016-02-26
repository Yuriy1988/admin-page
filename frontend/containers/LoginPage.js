import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import LoginForm from '../components/LoginForm'
import Content from '../components/Content'

class LoginPage extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        document.body.className="hold-transition login-page";
    }
    componentWillUnmount() {
        document.body.className="skin-green-light";
    }

    render() {
        const { children } = this.props;

        return (
            <div className="hold-transition login-page">
                <div className="login-box">  {/* <body className="hold-transition login-page">*/}
                    <div className="login-logo">
                        <a href="../../index2.html"><b>XOP</b>ay</a>
                    </div>
                    <div className="login-box-body">
                        <p className="login-box-msg">Sign in to administrator panel</p>
                        <LoginForm />
                    </div>

                    {/*</body>*/}
                    {/*<Content>
                     <div className="box">
                     <div className="box-header with-border">
                     <h1 className="box-title">Authorisation</h1>
                     </div>
                     <div className="box-body">
                     <div className="alert alert-info ng-scope">
                     <p >Login: test</p>
                     <p >Password: test</p>
                     </div>
                     <LoginForm />
                     </div>
                     </div>
                     {children}
                     </Content>*/}
                </div>
            </div>
        )
    }
}


export default connect()(LoginPage)

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import LoginForm from '../components/LoginForm'
import Content from '../components/Content'

class LoginPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { children } = this.props;

        return (
            <Content>
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
            </Content>
        )
    }
}


export default connect()(LoginPage)

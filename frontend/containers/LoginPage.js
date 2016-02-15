import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import LoginForm from '../components/LoginForm'


class LoginPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { children } = this.props;

        return (
            <div>
                <div className="alert alert-info ng-scope">
                    <p >Login: test</p>
                    <p >Password: test</p>
                </div>
                <LoginForm />
                {children}
            </div>
        )
    }
}


export default connect()(LoginPage)

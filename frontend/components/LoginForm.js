import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as UserActions from '../actions/user'

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            login: "",
            password: ""
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        const {makeLogin} = this.props;
        const {login,password} = this.state;
        makeLogin(login, password);
        e.preventDefault();
    }

    render() {
        const {login,password} = this.state;

        return (
            <form name="form" role="form" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Login&nbsp;</label>
                    <i className="fa fa-key"/>
                    <input type="text"
                           value={login}
                           id="username"
                           onChange={this.handleChange}
                           name="login"
                           className="form-control"/>
                    <span className="help-block">Login required</span>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password&nbsp;</label>
                    <i className="fa fa-lock"/>
                    <input type="password"
                           value={password}
                           id="password"
                           onChange={this.handleChange}
                           name="password"
                           className="form-control"/>
                    <span className="help-block">Password required</span>
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn btn-danger">Enter</button>
                </div>
            </form>
        )
    }
}


export default connect((state)=> {
    return {user: state.user, session: state.session}
}, {
    makeLogin: UserActions.login
})(LoginForm)

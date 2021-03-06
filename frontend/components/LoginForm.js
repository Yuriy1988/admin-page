import React, {Component, PropTypes} from 'react'
import LoadingOverlay from '../components/LoadingOverlay';
import {connect} from 'react-redux'
import * as UserActions from '../actions/user'
import getServerVersion from '../actions/system'
import Alert, {TYPE_ERROR, TYPE_WARNING} from '../components/Alert'
import {Link} from 'react-router'
import Transition from '../containers/Transition';

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            login: "",
            password: "",
        };
    }

    componentWillUnmount() {
        const {user} = this.props;
        this.props.getServerVersion();
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('user_message', '');
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        const {makeLogin} = this.props;
        const {login, password} = this.state;
        makeLogin(login, password);
        e.preventDefault();
    }

    render() {
        const {login, password} = this.state;
        const {user} = this.props;
        return (
            <div>
                <form name="form" role="form"  onSubmit={this.handleSubmit}>
                    <Alert type={TYPE_ERROR}>
                        {user.error}
                    </Alert>
                    <Alert type={TYPE_ERROR}>
                        {user.success}
                    </Alert>
                    <Alert type={TYPE_WARNING}>
                        {localStorage.user_message}
                    </Alert>
                    <div className="form-group has-feedback">
                        <input type="text"
                               value={login}
                               id="username"
                               onChange={this.handleChange}
                               name="login"
                               placeholder="Login"
                               className="form-control"/>

                        <span className="glyphicon glyphicon-user form-control-feedback"/>
                    </div>
                    <div className="form-group has-feedback">
                        <input type="password"
                               value={password}
                               id="password"
                               onChange={this.handleChange}
                               name="password"
                               placeholder="Password"
                               className="form-control"/>
                        <span className="glyphicon glyphicon-lock form-control-feedback"/>
                    </div>
                    <div className="row">
                        <Link to="/admin/dev/user/recover_password" className="forgot-pass"><span>forgot password?</span></Link>
                        <div className="col-xs-offset-8 col-xs-4">
                            <button type="submit" className="btn btn-success btn-block btn-flat log-btn">Sign In
                            </button>
                        </div>
                    </div>
                </form>
                <LoadingOverlay loading={user.isFetching }/>
            </div>
        )
    }
}

export default connect((state)=> {
    return {user: state.user}
}, {
    makeLogin: UserActions.login,
    getServerVersion: getServerVersion
})(LoginForm);
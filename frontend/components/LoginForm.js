//TODO refactor
import React, {Component, PropTypes} from 'react'
import LoadingOverlay from '../components/LoadingOverlay';
import {connect} from 'react-redux'
import * as UserActions from '../actions/user'
import Alert, {TYPE_ERROR} from '../components/Alert'
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

    componentDidMount() {
        //  'after server implementation here will be function that gets server version'
        //this.props.getServerVersion();
    }

    componentWillUnmount() {
        localStorage.setItem('user',JSON.stringify(store.getState().user));
        setInterval(function tokenRefresh() {

            function refreshToken(url) {
                return new Promise(function (resolve, reject) {

                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', url, true);
                    xhr.setRequestHeader("Authorization", 'Bearer ' + window.localStorage.user_token);
                    xhr.onload = function () {
                        if (this.status === 200) {
                            resolve(this.response);
                        } else {
                            var error = new Error(this.statusText);
                            error.code = this.status;
                            reject(error);
                        }
                    };

                    xhr.onerror = function () {
                        reject(new Error("Network Error"));
                    };

                    xhr.send();
                });
            }

            var API_VERSION = localStorage.version || "dev";
            if (window.localStorage.user_token) {
                refreshToken(`${location.origin}/api/admin/${API_VERSION}/authorization/token`)
                    .then(
                        response => localStorage.setItem("user_token", (`${JSON.parse(response).token}`)),
                        error => console.log(`Rejected: ${error}`));
            }
        }, store.getState().user.exp-Date.now()/1000 - 300);
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
    makeLogin: UserActions.login
})(LoginForm)

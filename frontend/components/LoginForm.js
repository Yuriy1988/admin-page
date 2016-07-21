//TODO refactor
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as UserActions from '../actions/user'
import * as SystemsActions from '../actions/system'
import Alert,{TYPE_ERROR} from '../components/Alert'
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
    componentDidMount() {
      //  'after server implementation here will be function that gets server version'
     //   this.props.getServerVersion();
    }

    componentWillUnmount() {
        console.log(this.props.refreshToken);
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
        const {user} = this.props;

        return (
            <form name="form" role="form" onSubmit={this.handleSubmit}>
                <Alert type={TYPE_ERROR} >
                    {user.error}
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
                    <div className="col-xs-offset-8 col-xs-4">
                        <button type="submit" className="btn btn-success btn-block btn-flat">Sign In</button>
                    </div>
                </div>
            </form>
        )
    }
}


export default connect((state)=> {
    return {user: state.user, session: state.session}
}, {
    makeLogin: UserActions.login,
    getServerVersion: SystemsActions.getServerVersion,
    refreshToken: SystemsActions.refreshToken
})(LoginForm)

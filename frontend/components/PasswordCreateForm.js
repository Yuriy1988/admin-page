import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import * as UserActions from '../actions/user'
import * as SystemsActions from '../actions/system'
class PasswordCreateForm extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            password: "",
            PasswordToConfirm: ""
        };
    }

    componentDidMount() {
        //  'after server implementation here will be function that gets server version'
        //   this.props.getServerVersion();
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        const {createPassword} = this.props;
        const {password, PasswordToConfirm} = this.state;
        createPassword(password, PasswordToConfirm);
        e.preventDefault();
    }

    render() {
        const {password, PasswordToConfirm} = this.state;
        const {user} = this.props; //????????

        return (
            <form name="form" role="form" onSubmit={this.handleSubmit}>
                {/*<Alert type={TYPE_ERROR}>*/}
                    {/*{user.error}*/}
                {/*</Alert>*/}
                <div className="form-group has-feedback">
                    <input type="text"
                           value={password}
                           id="password"
                           onChange={this.handleChange}
                           name="password"
                           placeholder="password"
                           className="form-control"/>

                    <span className="glyphicon glyphicon-user form-control-feedback"/>
                </div>
                <div className="form-group has-feedback">
                    <input type="PasswordToConfirm"
                           value={PasswordToConfirm}
                           id="PasswordToConfirm"
                           onChange={this.handleChange}
                           name="PasswordToConfirm"
                           placeholder="Confirm your password"
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
    return {user: state.user}
}, {
    makeLogin: UserActions.confrimPassword,
    getServerVersion: SystemsActions.getServerVersion,
})(PasswordCreateForm)

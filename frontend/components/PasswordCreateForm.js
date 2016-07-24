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
        console.log('create password');
        const {createPassword} = this.props;
        const {password, PasswordToConfirm} = this.state;
        //todo refactor, handle errors
        if (password === PasswordToConfirm && password.length >= 8) {
            createPassword(password);
        } else {
            console.log('password is less then 8 characters or it doesn\'t match;')
        }
        e.preventDefault();
    }

    render() {
        const {password, PasswordToConfirm} = this.state;
        return (
            <form name="form" role="form" onSubmit={this.handleSubmit}>
                {/*<Alert type={TYPE_ERROR}>*/}
                {/*{user.error}*/}
                {/*</Alert>*/}
                <div className="form-group has-feedback">
                    <input type="password"
                           value={password}
                           id="password"
                           onChange={this.handleChange}
                           name="password"
                           placeholder="Enter new password here"
                           className="form-control"/>

                    <span className="glyphicon glyphicon-lock form-control-feedback"/>
                </div>
                <div className="form-group has-feedback">
                    <input type="password"
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
                        <button type="submit" className='btn btn-success btn-block btn-flat'>Crete</button>
                    </div>
                </div>
            </form>
        )
    }
}


export default connect((state)=> {
    return {user: state.user}
}, {
    createPassword: UserActions.createPassword,
    getServerVersion: SystemsActions.getServerVersion,
})(PasswordCreateForm)

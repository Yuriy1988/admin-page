import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import * as UserActions from '../actions/user'
import Alert, {TYPE_ERROR, TYPE_SUCCESS} from '../components/Alert'
import LoadingOverlay from '../components/LoadingOverlay';

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

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        const token = window.location.search.substring(7, window.location.search.length);
        const {createPassword} = this.props;
        const {password, PasswordToConfirm} = this.state;
        if (password === PasswordToConfirm) {
            createPassword(password, token);
            if (password.length >= 8) {
                this.refs.btn.disabled = true;
                this.refs.passForm1.className = 'form-group has-feedback has-success';
                this.refs.passForm2.className = 'form-group has-feedback has-success';
                setTimeout(function () {
                    window.location.pathname = '/admin'
                }, 5000);
            }
        } else {
            this.refs.passForm1.className = 'form-group has-feedback has-error';
            this.refs.passForm2.className = 'form-group has-feedback has-error';
        }
        e.preventDefault();
    }

    render() {
        const {password, PasswordToConfirm} = this.state;
        const {user} = this.props;
        console.log(user.success);
        if (user.success) {
            user.isFetching = true;
        }
        return (
            <div>
                <form name="form" role="form" onSubmit={this.handleSubmit}>
                    <Alert type={TYPE_ERROR}>
                        {user.error}
                    </Alert>
                    <Alert type={TYPE_SUCCESS}>
                        {user.success}
                    </Alert>
                    <div ref="passForm1" className="form-group has-feedback">
                        <input type="password"
                               value={password}
                               id="password"
                               onChange={this.handleChange}
                               name="password"
                               placeholder="Enter new password here"
                               className="form-control"/>

                        <span className="glyphicon glyphicon-lock form-control-feedback"/>
                    </div>
                    <div ref="passForm2" className="form-group has-feedback">
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
                            <button ref="btn" type="submit" className='btn btn-success btn-block btn-flat'>Crete
                            </button>
                        </div>
                    </div>
                </form>
                <LoadingOverlay loading={user.isFetching}/>
            </div>
        )
    }
}


export default connect((state)=> {
    return {user: state.user}
}, {
    createPassword: UserActions.createPassword,
})(PasswordCreateForm)
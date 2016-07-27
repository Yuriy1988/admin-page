import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {merge} from 'lodash'
import * as UserActions from './../../actions/user'
import Alert, {TYPE_ERROR, TYPE_SUCCESS} from './../../components/Alert'

class selfPassChangingForm extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            oldPass: "",
            password: "",
            PasswordToConfirm: ""
        };
    }

    componentWillMount() {
        const {user} = this.props;
        user.error = '';
        user.success = '';
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        const {changeSelfPassword} = this.props;
        const {oldPass, password, PasswordToConfirm} = this.state;

        if (oldPass.length >= 8) {
            this.refs.oldPassForm.className = 'form-group has-feedback has-success';
        } else {
            this.refs.oldPassForm.className = 'form-group has-feedback has-error';
        }

        if (password === PasswordToConfirm && oldPass.length >= 8) {
            changeSelfPassword(oldPass, password);
            if (password.length >= 8) {
                this.refs.passForm1.className = 'form-group has-feedback has-success';
                this.refs.passForm2.className = 'form-group has-feedback has-success';
            }
        } else {
            this.refs.passForm1.className = 'form-group has-feedback has-error';
            this.refs.passForm2.className = 'form-group has-feedback has-error';
        }
        e.preventDefault();
    }

    render() {
        const {oldPass, password, PasswordToConfirm} = this.state;
        const {user} = this.props;
        const btnStyle = {      //refactor
            marginBottom: '10px'
        };

        if (user.success) {
            user.error = '';
        }

        if (this.props.user.success) {
            this.refs.btn.disabled = true;
            setTimeout(function () {
                window.location.pathname = 'admin'
            }, 3000);
            window.localStorage.setItem('user_token', '');
        }
        return (
            <div>
                <form name="oldPassForm" role="form" onSubmit={this.handleSubmit}>
                    <div ref="oldPassForm" className="form-group has-feedback">
                        <input type="password"
                               value={oldPass}
                               id="oldPass"
                               onChange={this.handleChange}
                               name="oldPass"
                               placeholder="Enter your current password here"
                               className="form-control"/>
                        <span className="glyphicon glyphicon-lock form-control-feedback"/>
                    </div>
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
                        <div className="col-xs-offset-8 col-xs-4" style={btnStyle}>
                            <button ref="btn" type="submit" className='btn btn-success btn-block btn-flat'>Change your
                                password
                            </button>
                        </div>
                    </div>
                </form>
                <Alert type={TYPE_ERROR}>
                    {user.error}
                </Alert>
                <Alert type={TYPE_SUCCESS}>
                    {user.success}
                </Alert>
            </div>
        )
    }
}

export default connect((state)=> {
    return {
        user: state.user,
    }
}, {
    changeSelfPassword: UserActions.changeSelfPassword,
})(selfPassChangingForm)
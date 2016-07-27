import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { merge } from 'lodash'
import * as UserActions from './../../actions/user'
import Alert, {TYPE_ERROR, TYPE_SUCCESS} from './../../components/Alert'
import LoadingOverlay from './../../components/LoadingOverlay';

class merchantPassChangingForm extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
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
        debugger;
        const merchantId = this.props.params.merchantId;
        const {changeMerchantPassword} = this.props;
        const {password, PasswordToConfirm} = this.state;
        if (password === PasswordToConfirm) {
            console.log(changeMerchantPassword);
            changeMerchantPassword(password, merchantId);
            if (password.length >= 8) {
                this.refs.btn.disabled = true;
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
        const {password, PasswordToConfirm} = this.state;
        const {user} = this.props;
        if (user.success) {
            user.isFetching = true;
        }
        return (
            <div>
                <form name="form" role="form" onSubmit={this.handleSubmit}>

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
                            <button ref="btn" type="submit" className='btn btn-success btn-block btn-flat'>Change merchant's password
                            </button>
                        </div>
                    </div>
                </form>
                <LoadingOverlay loading={user.isFetching}/>
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
    return {user: state.user}
}, {
    changeMerchantPassword: UserActions.changeMerchantPassword,
})(merchantPassChangingForm)
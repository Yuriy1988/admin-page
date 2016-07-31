import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import { browserHistory } from 'react-router'
import {merge} from 'lodash'
import * as UserActions from './../../actions/user'
import Alert, {TYPE_ERROR, TYPE_SUCCESS} from './../../components/Alert'

class merchantPassChangingForm extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            merchPassword: "",
            passwordToConfirm: ""
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
        const merchantId = this.props.params.merchantId;
        const {changeMerchantPassword, merchants} = this.props;
        const {merchPassword, passwordToConfirm} = this.state;
        const userId = merchants[merchantId].user.id;

        if (merchPassword === passwordToConfirm) {
            changeMerchantPassword(merchPassword, userId);
            if (merchPassword.length >= 8) {
                this.refs.btn.disabled = true;
                this.refs.passForm1.className = 'form-group has-feedback has-success';
                this.refs.passForm2.className = 'form-group has-feedback has-success';
                setTimeout(function() { browserHistory.goBack()}, 3000)
            }
        } else {
            this.refs.passForm1.className = 'form-group has-feedback has-error';
            this.refs.passForm2.className = 'form-group has-feedback has-error';
        }
        e.preventDefault();
    }

    render() {
        const {merchPassword, passwordToConfirm} = this.state;
        const {user} = this.props;

        if (user.success) {
            user.error ='';
        }
        debugger;
        return (
            <div className="col-xs-4">
                <form name="form" role="form" onSubmit={this.handleSubmit}>

                    <div ref="passForm1" className="form-group has-feedback">
                        <input type="password"
                               value={merchPassword}
                               id="merchPassword"
                               onChange={this.handleChange}
                               name="merchPassword"
                               placeholder="Enter new password here"
                               className="form-control"/>
                        <span className="glyphicon glyphicon-lock form-control-feedback"/>
                    </div>
                    <div ref="passForm2" className="form-group has-feedback">
                        <input type="password"
                               value={passwordToConfirm}
                               id="passwordToConfirm"
                               onChange={this.handleChange}
                               name="passwordToConfirm"
                               placeholder="Confirm your password"
                               className="form-control"/>
                        <span className="glyphicon glyphicon-lock form-control-feedback"/>
                    </div>
                    <div className="row">
                            <button ref="btn" type="submit" className='btn btn-success btn-block btn-flat'>Change
                                merchant's password
                            </button>
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
        merchants: state.entities.merchants
    }
}, {
    changeMerchantPassword: UserActions.changeMerchantPassword,
})(merchantPassChangingForm)
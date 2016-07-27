import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import * as UserActions from '../actions/user'
import Alert, {TYPE_ERROR, TYPE_SUCCESS} from '../components/Alert'
import LoadingOverlay from '../components/LoadingOverlay';

class PasswordRecoveryForm extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            login: '',
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
        const {recoverPassword} = this.props;
        const {login} = this.state;
        recoverPassword(login);
        e.preventDefault();
    }

    render() {
        const {login} = this.state;
        const {user} = this.props;

        if (user.success) {
            user.isFetching = true;
            this.refs.btn.disabled = true;
            setTimeout(function() { window.location.pathname = '/admin' }, 5000);
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
                    <div className="form-group has-feedback">
                        <input type="text"
                               value={login}
                               id="login"
                               onChange={this.handleChange}
                               name="login"
                               placeholder="Login"
                               className="form-control"/>

                        <span className="glyphicon glyphicon-user form-control-feedback"/>
                    </div>

                    <div className="row">
                        <div className="col-xs-offset-8 col-xs-4">
                            <button ref='btn' type="submit" className='btn btn-success btn-block btn-flat'>Submit</button>
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
    recoverPassword: UserActions.recoverPassword
})(PasswordRecoveryForm)
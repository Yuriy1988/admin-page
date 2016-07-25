import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import * as UserActions from '../actions/user'
import * as SystemsActions from '../actions/system'

class PasswordRecoveryForm extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            login: '',
        };
    }


    componentDidMount() {
         this.props.getServerVersion();
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
        return (
            <form name="form" role="form" onSubmit={this.handleSubmit}>
                {/*<Alert type={TYPE_ERROR}>*/}
                {/*{user.error}*/}
                {/*</Alert>*/}
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
                        <button type="submit" className='btn btn-success btn-block btn-flat'>Submit</button>
                    </div>
                </div>
            </form>
        )
    }
}


export default connect((state)=> {
    return {user: state.user}
}, {
    recoverPassword: UserActions.recoverPassword,
    getServerVersion: SystemsActions.getServerVersion,
})(PasswordRecoveryForm)
import React, {Component, PropTypes} from 'react';
import Field from '../../components/Field'

export default class ManagerForm extends Component {
    constructor (props) {
        super(props);
        let {selectedManager} = this.props;

        this.state = {
            username: `${selectedManager.user.username || ''}`,
            email: `${selectedManager.user.email || ''}`,
            groups: ['manager'],
            first_name: `${selectedManager.user.firstName || ''}`,
            last_name: `${selectedManager.user.lastName || ''}`,
            phone: `${selectedManager.user.phone || ''}`,
            notify: `${selectedManager.user.notify || 'EMAIL'}`,
            enabled: `${selectedManager.user.enabled || true}`
        };
    }

    onSubmit (e) {
        e.preventDefault();
        this.props.onSubmit(this.state);
    }

    handleChange (e) {
        this.setState({[e.target.name]: e.target.value});
    }

    HandleCheckBox(e) {
        this.setState({[e.target.name]: e.target.checked});
    }

    HandleSelectOption(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render () {
        const {errors} = this.props.selectedManager;
        return (
            <form role="form" onSubmit={this.onSubmit.bind(this)}>

                <div className="row">
                    <div className="col-xs-12 col-sm-6">
                        <Field error={errors.username}>
                            <label htmlFor="username">Username</label>
                            <input className="form-control" type="text" name="username"
                                   placeholder="Please, enter username"
                                   onChange={this.handleChange.bind(this)}
                                   value={this.state.username}/>
                        </Field>
                    </div>

                    <div className="col-xs-12 col-sm-6">
                        <Field error={errors.email}>
                            <label htmlFor="email">Email</label>
                            <input className="form-control" type="text" name="email"
                                   placeholder="Please, enter e-mail" onChange={this.handleChange.bind(this)}
                                   value={this.state.email}/>
                        </Field>
                    </div>

                    <div className="col-xs-12 col-sm-6">
                        <Field error={errors.firstName}>
                            <label htmlFor="first_name">First name</label>
                            <input value={this.state.first_name}
                                   className="form-control" type="text" name="first_name"
                                   placeholder="Please, enter first name" onChange={this.handleChange.bind(this)}/>
                        </Field>
                    </div>
                    <div className="col-xs-12 col-sm-6">
                        <Field error={errors.lastName}>
                            <label htmlFor="last_name">Last name</label>
                            <input value={this.state.last_name}
                                   className="form-control" type="text" name="last_name"
                                   placeholder="Please, enter last name" onChange={this.handleChange.bind(this)}/>
                        </Field>
                    </div>
                    <div className="col-xs-12 col-sm-6">
                        <Field error={errors.phone}>
                            <label htmlFor="phone">Phone</label>
                            <input value={this.state.phone}
                                   className="form-control" type="text" name="phone"
                                   placeholder="380938888888"
                                   onChange={this.handleChange.bind(this)}/>
                        </Field>
                    </div>

                    <div className="col-xs-12 col-sm-6">
                        <Field error={errors.notify}>
                            <label htmlFor="notify">Notification</label>
                            <select name = 'notify'
                                    className="form-control"
                                    onChange={this.HandleSelectOption.bind(this)}
                                    value={this.state.notify}>
                                <option value="NONE">Disabled</option>
                                <option value="EMAIL">Email</option>
                                <option value="PHONE">Phone</option>
                            </select>
                        </Field>
                    </div>

                    <div className="col-xs-12 col-sm-6">
                        <Field error={errors.enabled}>
                            <div className="checkbox">
                                <label >
                                    <input type="checkbox"
                                           name = 'enabled'
                                           onChange={this.HandleCheckBox.bind(this)}
                                           checked={this.state.enabled}/>
                                    Enabled
                                </label>
                            </div>
                        </Field>
                    </div>
                </div>
                <button className="btn pull-right btn-success"
                        type="submit">
                    <i className="fa fa-save"/>&nbsp;Save
                </button>
            </form>
        )
    }
}
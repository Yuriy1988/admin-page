import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import Field from '../../components/Field'

class NotificationForm extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);

        let {selectedNotification} = this.props;

        this.state = {
            name: `${selectedNotification.name || ''}`,
            case_regex: `${selectedNotification.caseRegex || ''}`,
            header_template: `${selectedNotification.headerTemplate || ''}`,
            case_template: `${selectedNotification.caseTemplate || ''}`,
            body_template: `${selectedNotification.bodyTemplate || ''}`,
            subscribers_template: `${selectedNotification.subscribersTemplate || ''}`
        };
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.state);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        const {errors} = this.props.selectedNotification.error;

        return (
            <form role="form" onSubmit={this.onSubmit.bind(this)}>

                <div className="row">
                    <div className="col-xs-12 col-sm-6">
                        <Field error={errors.name}>
                            <label htmlFor="name">name</label>
                            <input className="form-control" type="text" name="name"
                                   placeholder="Please, enter notification's name"
                                   onChange={this.handleChange.bind(this)}
                                   value={this.state.name}/>
                        </Field>
                    </div>

                    <div className="col-xs-12 col-sm-6">
                        <Field error={errors.case_regex}>
                            <label htmlFor="case_regex">case_regex</label>
                            <input className="form-control" type="text" name="case_regex"
                                   placeholder="Please, enter case_regex" onChange={this.handleChange.bind(this)}
                                   value={this.state.case_regex}/>
                        </Field>
                    </div>

                    <div className="col-xs-12 col-sm-6">
                        <Field error={errors.header_template}>
                            <label htmlFor="header_template">header_template</label>
                            <input value={this.state.header_template}
                                   className="form-control" type="text" name="header_template"
                                   placeholder="Please, enter header_template" onChange={this.handleChange.bind(this)}/>
                        </Field>
                    </div>
                    <div className="col-xs-12 col-sm-6">
                        <Field error={errors.case_template}>
                            <label htmlFor="case_template">case_template</label>
                            <input value={this.state.case_template}
                                   className="form-control" type="text" name="case_template"
                                   placeholder="Please, enter case_template" onChange={this.handleChange.bind(this)}/>
                        </Field>
                    </div>
                    <div className="col-xs-12 col-sm-6">
                        <Field error={errors.subscribers_template}>
                            <label htmlFor="subscribers_template">subscribers_template</label>
                            <input value={this.state.subscribers_template}
                                   className="form-control" type="text" name="subscribers_template"
                                   placeholder="Please, enter subscribers_template"
                                   onChange={this.handleChange.bind(this)}/>
                        </Field>
                    </div>
                    <div className="col-xs-12 col-sm-6">
                        <Field error={errors.body_template}>
                            <label
                                htmlFor="body_template">body_template</label>
                            <textarea value={this.state.body_template}
                                      name="body_template" className="form-control" rows="5"
                                      placeholder="Please, enter body_template"
                                      onChange={this.handleChange.bind(this)}/>
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

export default connect((store) => ({}), {})(NotificationForm);

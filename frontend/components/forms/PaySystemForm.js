import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {merge} from 'lodash'
import PaySysModel from '../../models/paymentSystem'
import Field from '../../components/Field'
import {changeHandlerMixin} from '../../mixins/index'

@changeHandlerMixin
class PaySystemForm extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.changeHandler(this);
        this.changePaySys = this.onChange('paysys');
        this._onSubmit = this._onSubmit.bind(this);

        this.state = {
            paysys: PaySysModel.create(props.initPaySystem)
        };
    }

    _onSubmit(e) {
        e.preventDefault();
        const {onSubmit} = this.props;
        const {paysys} = this.state;

        onSubmit(paysys);
    }

    render() {

        const _onSubmit = this._onSubmit;

        const {changePaySys} = this;

        let {paysys} = this.state;
        paysys = new PaySysModel(paysys);

        let errors = PaySysModel.createErrors();

        try {
            errors = Object.assign({}, errors, this.props.errors);
        } catch (e) {
        }


        return (

            <form role="form" onSubmit={_onSubmit}>
                <h4>
                    {paysys.name}
                </h4>
                <div className="row">
                    <div className="col-xs-12 col-sm-6">
                        <Field error={errors.paysys_login}>
                            <label htmlFor="login">Login</label>
                            <input type="text" className="form-control" id="login"
                                   onChange={changePaySys("paysys_login")}
                                   value={paysys.login}
                                   placeholder="Enter new login"/>
                        </Field>
                    </div>
                    <div className="col-xs-12 col-sm-6">
                        <Field error={errors.paysys_password}>
                            <label htmlFor="login">Password</label>
                            <input type="text" className="form-control" id="login"
                                   onChange={changePaySys("paysys_password")}
                                   value={paysys.password}
                                   placeholder="Enter new password"/>
                        </Field>
                    </div>
                </div>


                <div className="row">
                    <hr/>
                    <div className="col-sm-12">
                        <button className="btn pull-right btn-success"
                                type="submit">
                            <i className="fa fa-save"/>&nbsp;Save
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}


export default connect((store) => ({}), {})(PaySystemForm);

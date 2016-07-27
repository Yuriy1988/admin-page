import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { merge } from 'lodash'
import {RedirectActions, MerchantActions, DictionaryActions} from '../../actions/index'
import {changeHandlerMixin} from '../../mixins/index'

@changeHandlerMixin
class passChangingForm extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }


    render() {
        return (
            <form name="form" role="form" onSubmit={this.handleSubmit}>
                {/*<Alert type={TYPE_ERROR}>*/}
                {/*{user.error}*/}
                {/*</Alert>*/}
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
                        <button type="submit" className='btn btn-success btn-block btn-flat'>Crete</button>
                    </div>
                </div>
            </form>
        )
    }
}


export default connect(
    () => ({
    })
    ,
    {
        loadNotifications: DictionaryActions.loadNotifications,
        loadCurrencies: DictionaryActions.loadCurrencies
    }
)(passChangingForm);

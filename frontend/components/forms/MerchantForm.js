import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { merge } from 'lodash'
import {RedirectActions, MerchantActions, DictionaryActions} from '../../actions/index'
import MerchantModel from '../../models/merchant'
import Field from '../../components/Field'
import {changeHandlerMixin} from '../../mixins/index'
import CurrencySelect from '../../components/CurrencySelect'

@changeHandlerMixin
class MerchantForm extends Component {
    constructor(props) {
        super(props);


        this.onChange = this.changeHandler(this);
        this.changeMerchant = this.onChange("merchant");
        this.changeMerchantInfo = this.changeMerchant("merchant_info");
        this.changeMerchantAccount = this.changeMerchant("merchant_account");
        this.changeMerchantUser = this.changeMerchant("user");

        this._onCreate = this._onCreate.bind(this);

        this.state = {
            merchant: MerchantModel.create(props.initMerchant)
        };
    }

    componentDidMount() {
        const {loadNotifications, loadCurrencies} = this.props;
        loadCurrencies();
        loadNotifications();
    }

    _onCreate(e) {
        e.preventDefault();
        const { onSubmit } = this.props;
        const { merchant } = this.state;

        onSubmit(merchant);
    }

    render() {

        const onCreate = this._onCreate;

        const { changeMerchant, changeMerchantInfo, changeMerchantAccount, changeMerchantUser } = this;

        let { merchant } = this.state;
        merchant = new MerchantModel(merchant);

        let errors = MerchantModel.createErrors();

        try {
            errors = Object.assign({}, errors, this.props.errors);
        } catch (e) {
        }


        return (

            <form role="form" onSubmit={onCreate}>

                <div className="row">
                    <div className="col-xs-12">
                        <label htmlFor="name">Merchant name</label>
                        <Field error={errors.merchant_name}>
                            <input type="text" className="form-control" id="name"
                                   onChange={changeMerchant("merchant_name")}
                                   value={merchant.merchantName}
                                   placeholder="Please, insert merchant name"/>
                        </Field>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <h4>Main information</h4>

                        <Field error={errors.merchant_info.director_name}>
                            <label htmlFor="directorName">Chairman</label>
                            <input type="text" className="form-control " id="directorName"
                                   name="director_name"
                                   onChange={changeMerchantInfo("director_name")}
                                   value={merchant.merchantInfo.directorName}
                                   placeholder="Director name"/>
                        </Field>

                        <Field error={errors.merchant_info.address}>
                            <label htmlFor="address">Address</label>
                            <input type="text" className="form-control" id="address"
                                   onChange={changeMerchantInfo("address")}
                                   value={merchant.merchantInfo.address}
                                   placeholder="Address"/>
                        </Field>

                    </div>


                    <div className="col-md-4">

                        <h4>Merchant account</h4>

                        <Field error={errors.merchant_account.checking_account}>
                            <label htmlFor="checkingAccount">Checking Account</label>
                            <input type="text" className="form-control" id="checkingAccount"
                                   onChange={changeMerchantAccount("checking_account")}
                                   value={merchant.merchantAccount.checkingAccount}
                                   placeholder="Checking Account"/>
                        </Field>

                        <Field error={errors.merchant_account.mfo}>
                            <label htmlFor="mfo">MFO</label>
                            <input type="text" className="form-control" id="mfo"
                                   onChange={changeMerchantAccount("mfo")}
                                   value={merchant.merchantAccount.mfo}
                                   placeholder="MFO"/>
                        </Field>

                        <Field error={errors.merchant_account.okpo}>
                            <label htmlFor="okpo">OKPO</label>
                            <input type="text" className="form-control" id="okpo"
                                   onChange={changeMerchantAccount("okpo")}
                                   value={merchant.merchantAccount.okpo}
                                   placeholder="OKPO"/>
                        </Field>


                        <Field error={errors.merchant_account.bank_name}>
                            <label htmlFor="bankName">Bank Name</label>
                            <input type="text" className="form-control" id="bankName"
                                   placeholder="Bank Name"
                                   onChange={changeMerchantAccount("bank_name")}
                                   value={merchant.merchantAccount.bankName}/>
                        </Field>

                        <Field error={errors.merchant_account.currency}>
                            <label htmlFor="currency">Currency</label>
                            <CurrencySelect id="currency"
                                            onChange={changeMerchantAccount("currency")}
                                            value={merchant.merchantAccount.currency}/>
                        </Field>

                    </div>
                    <div className="col-md-4">

                        <h4 >User info</h4>

                        <Field error={errors.user.username}>
                            <label htmlFor="userName">Username (login)</label>
                            <input type="text" className="form-control" id="userName"
                                   onChange={changeMerchantUser("username")}
                                   value={merchant.user.username}
                                   placeholder="Username"/>
                        </Field>

                        <Field error={errors.user.first_name}>
                            <label htmlFor="firstName">First name</label>
                            <input type="text" className="form-control" id="firstName"
                                   placeholder="First name"
                                   onChange={changeMerchantUser("first_name")}
                                   value={merchant.user.firstName}/>
                        </Field>

                        <Field error={errors.user.last_name}>
                            <label htmlFor="firstName">Last name</label>
                            <input type="text" className="form-control" id="lastName"
                                   placeholder="Last name"
                                   onChange={changeMerchantUser("last_name")}
                                   value={merchant.user.lastName}/>
                        </Field>

                        <Field error={errors.user.email}>
                            <label htmlFor="email">Email</label>
                            <input type="text" className="form-control" id="email" placeholder="Email"
                                   onChange={changeMerchantUser("email")}
                                   value={merchant.user.email}/>
                        </Field>

                        <Field error={errors.user.phone}>
                            <label htmlFor="phone">Phone</label>
                            <div className="input-group">
                                <span className="input-group-addon">+</span>
                                <input type="text" className="form-control" id="phone" placeholder="380991234567"
                                       onChange={changeMerchantUser("phone")}
                                       value={merchant.user.phone}/>
                            </div>

                        </Field>

                        <Field error={errors.user.notify}>
                            <label htmlFor="notify">Notification</label>
                            <select className="form-control" id="notify"
                                    onChange={changeMerchantUser("notify")}
                                    value={merchant.user.notify}>
                                <option value="null">Disabled</option>
                                <option value="EMAIL">Email</option>
                                <option value="PHONE">Phone</option>
                            </select>
                        </Field>

                        <Field error={errors.user.enabled}>
                            <div className="checkbox">
                                <label >
                                    <input type="checkbox" id="enabled"
                                           onChange={changeMerchantUser("enabled")}
                                           checked={merchant.user.enabled}/>
                                    Enabled
                                </label>
                            </div>
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


export default connect(
    (store) => ({
        currencies: store.dictionary.currency,
        notifies: store.dictionary.notify
    })
    ,
    {
        loadNotifications: DictionaryActions.loadNotifications,
        loadCurrencies: DictionaryActions.loadCurrencies,
    }
)(MerchantForm);

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { merge } from 'lodash'
import {RedirectActions, StoreActions, DictionaryActions} from '../../actions/index'
import MerchantContractModel from '../../models/merchantContract'
import Field from '../../components/Field'
import {changeHandlerMixin} from '../../mixins/index'
import CurrencySelect from '../../components/CurrencySelect'


@changeHandlerMixin
class MerchantContractForm extends Component {
    constructor(props) {

        super(props);

        this._onCreate = this._onCreate.bind(this);

        this.onChange = this.changeHandler(this)("merchantContract");

        this.state = {
            merchantContract: MerchantContractModel.create(props.initMerchantContract)
        };

    }

    _onCreate(e) {
        e.preventDefault();
        const { onSubmit } = this.props;
        const { merchantContract } = this.state;
        onSubmit(merchantContract);
    }

    render() {
        const { cancel } = this.props;

        let { merchantContract } = this.state;
        merchantContract = new MerchantContractModel(merchantContract);

        const onCreate = this._onCreate;
        const onChange = this.onChange;

        let errors = MerchantContractModel.createErrors();

        try {
            errors = Object.assign({}, errors, this.props.errors);
        } catch (e) {
        }


        return (
            <form role="form" onSubmit={onCreate}>
                <div className="row">
                    <div className="col-md-12">
                        <h4 >Contract information</h4>

                        {/*
                         commission_fixed: decimal,	// {required}
                         commission_pct: decimal,	// {required}
                         contract_doc_url: url,		// {required}
                         currency: enum		// {required} одна из Currency Enum
                         active: boolean,		// {default=false}
                         filter: string,
                        */}
                        <Field error={errors.commission_fixed}>
                            <label htmlFor="commissionFixed">commissionFixed</label>
                            <input type="text" className="form-control " id="commissionFixed"
                                   onChange={onChange("commission_fixed")}
                                   value={merchantContract.commissionFixed}
                                   placeholder="1.2"/>
                        </Field>

                        <Field error={errors.commission_pct}>
                            <label htmlFor="commissionPct">commissionPct</label>
                            <input type="text" className="form-control " id="commissionPct"
                                   onChange={onChange("commission_pct")}
                                   value={merchantContract.commissionPct}
                                   placeholder="2.4"/>
                        </Field>

                        <Field error={errors.contract_doc_url}>
                            <label htmlFor="contractDocUrl">contractDocUrl</label>
                            <input type="text" className="form-control " id="contractDocUrl"
                                   onChange={onChange("contract_doc_url")}
                                   value={merchantContract.contractDocUrl}
                                   placeholder="http://example.com/contract.pdf"/>
                        </Field>

                        <Field error={errors.filter}>
                            <label htmlFor="filter">filter</label>
                            <input type="text" className="form-control " id="filter"
                                   onChange={onChange("filter")}
                                   value={merchantContract.filter}
                                   placeholder="*"/>
                        </Field>


                        <Field error={errors.currency}>
                            <label htmlFor="currency">Currency</label>
                            <CurrencySelect id="currency"
                                            onChange={onChange("currency")}
                                            value={merchantContract.currency}/>
                        </Field>

                        <Field error={errors.active}>
                            <div className="checkbox">
                                <label >
                                    <input type="checkbox" id="active"
                                           onChange={onChange("active")}
                                           checked={merchantContract.active}/>
                                    Active
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

MerchantContractForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

export default connect(
    (state)=>({
        merchantContracts: state.entities.merchantContracts
    }),
    {

    }
)(MerchantContractForm)

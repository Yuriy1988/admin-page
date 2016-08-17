import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {merge} from 'lodash'
import {RedirectActions, StoreActions, DictionaryActions} from '../../actions/index'
import PaySystemContractModel from '../../models/paysystemContract'
import Field from '../../components/Field'
import {changeHandlerMixin} from '../../mixins/index'
import CurrencySelect from '../../components/CurrencySelect'


@changeHandlerMixin
class PaySystemContractForm extends Component {
    constructor(props) {

        super(props);

        this._onCreate = this._onCreate.bind(this);

        this.onChange = this.changeHandler(this)("contract");

        this.state = {
            contract: PaySystemContractModel.create(props.initContract)
        };

    }

    componentWillMount() {
        this.props.loadPaymentInterfaces();
    }

    _onCreate(e) {
        e.preventDefault();
        const {onSubmit} = this.props;
        const {contract} = this.state;
        onSubmit(contract);
    }

    render() {
        const {cancel, category} = this.props;
        let {contract} = this.state;
        contract = new PaySystemContractModel(contract);

        const onCreate = this._onCreate;
        const onChange = this.onChange;

        let errors = PaySystemContractModel.createErrors();

        try {
            errors = Object.assign({}, errors, this.props.errors);
        } catch (e) {
        }

        return (

            <form role="form" onSubmit={onCreate}>
                <div className="row">
                    <div className="col-md-12">
                        <h4 >Contract information</h4>

                        <Field error={errors.contractor_name}>
                            <label htmlFor="contractor_name">Contractor name</label>
                            <input type="text" className="form-control " id="contractor_name"
                                   onChange={onChange("contractor_name")}
                                   value={contract.contractorName}
                                   placeholder="Ivanov Ivan"/>
                        </Field>


                        <Field>
                            <label htmlFor="Select payment interface">Select payment interface</label>
                            <select className="form-control status-input">
                                {category.map(function(result) {
                                    return <option key={Math.random()}>{result}</option>;
                                })}
                            </select>

                        </Field>

                        <Field error={errors.filter}>
                            <label htmlFor="filter">Filter</label>
                            <input type="text" className="form-control " id="filter"
                                   onChange={onChange("filter")}
                                   value={contract.filter}
                                   placeholder="*"/>
                        </Field>

                        <Field error={errors.commission_fixed}>
                            <label htmlFor="commission_fixed">Commission fixed</label>
                            <input type="text" className="form-control " id="commission_fixed"
                                   onChange={onChange("commission_fixed")}
                                   value={contract.commissionFixed}
                                   placeholder="1.2"/>
                        </Field>
                        <Field error={errors.commission_pct}>
                            <label htmlFor="commission_pct">Commission pct</label>
                            <input type="text" className="form-control " id="commission_pct"
                                   onChange={onChange("commission_pct")}
                                   value={contract.commissionPct}
                                   placeholder="2.4"/>
                        </Field>
                        <Field error={errors.contract_doc_url}>
                            <label htmlFor="contract_doc_url">Contract document URL</label>
                            <input type="text" className="form-control " id="contract_doc_url"
                                   onChange={onChange("contract_doc_url")}
                                   value={contract.contractDocUrl}
                                   placeholder="http://example.com/contract.pdf"/>
                        </Field>

                        <Field error={errors.currency}>
                            <label htmlFor="currency">Currency</label>
                            <CurrencySelect id="currency"
                                            onChange={onChange("currency")}
                                            value={contract.currency}/>
                        </Field>
                        <Field error={errors.active}>
                            <div className="checkbox">
                                <label >
                                    <input type="checkbox" id="active"
                                           onChange={onChange("active")}
                                           checked={contract.active}/>
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

PaySystemContractForm.propTypes = {
    onSubmit: PropTypes.func.isRequired

};

PaySystemContractForm.propTypes = {
    category: React.PropTypes.array.isRequired,
};

export default connect(
    (state)=>({
        category: state.dictionary.category,
        paysysContracts: state.entities.paysysContracts,
    }),
    { loadPaymentInterfaces: DictionaryActions.loadPaymentInterfaces}
)(PaySystemContractForm)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import {DictionaryActions} from '../actions/index'

export default class CurrencySelect extends Component {

    render() {
        const { currencies } = this.props;

        return (
            <select className="form-control" {...this.props} >
                {
                    currencies.map((item)=> {
                        return <option value={item}>{item}</option>
                    })
                }
            </select>
        );
    }
}

export default connect(
    (state)=>({
        currencies: state.dictionary.currency
    }),
    {
        loadCurrenies: DictionaryActions.loadCurrencies
    }
)(CurrencySelect)


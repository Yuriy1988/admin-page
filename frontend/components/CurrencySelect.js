import React, { Component } from 'react'
import { connect } from 'react-redux'
import {DictionaryActions} from '../actions/index'

export default class CurrencySelect extends Component {
    componentDidMount() {
        this.props.loadCurrenies();
    }

    render() {
        const { currencies, children } = this.props;

        return (
            <select className="form-control" {...this.props} >
                {children}
                {
                    currencies.map((item, i)=> {
                        return <option key={i} value={item}>{item}</option>
                    })
                }
            </select>
        );
    }
}

const mapStateToProps = (state)=>({
    currencies: state.dictionary.currency
});

const mapActionsToProps = {
    loadCurrenies: DictionaryActions.loadCurrencies
};

export default connect(mapStateToProps, mapActionsToProps)(CurrencySelect)


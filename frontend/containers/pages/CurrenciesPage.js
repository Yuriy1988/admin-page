import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import {RedirectActions, CurrenciesActions, DictionaryActions} from '../../actions/index'
import Alert, {TYPE_ERROR} from '../../components/Alert'
import LoadingOverlay from '../../components/LoadingOverlay'

class StoreAddPage extends Component {
    constructor(props) {

        super(props);

    }

    componentDidMount() {
        const {loadHistory} = this.props;

        loadHistory();
    }

    render() {
        const { currencyHistoryPagination, currencyHistory} = this.props;


        return (
            <div className="box">
                <div className="box-body table-responsive ">
                    <table className="table table-hover">
                        <tbody>
                        <tr>
                            <th>Date</th>
                            <th>Currency</th>
                            <th>Rate</th>
                        </tr>
                        {
                            currencyHistoryPagination.ids.map((id) => {
                                return (
                                    <tr>
                                        <td>{currencyHistory[id].commitTime}</td>
                                        <td>{currencyHistory[id].fromCurrency}/{currencyHistory[id].toCurrency}</td>
                                        <td>{currencyHistory[id].rate}</td>
                                    </tr>
                                )
                            })
                        }

                        </tbody>
                    </table>
                </div>
                <LoadingOverlay loading={currencyHistoryPagination.isFetching}/>
            </div>
        )
    }
}


export default connect(
    (state)=>({
        currencyHistoryPagination: state.pagination.currencyHistory,
        currencyHistory: state.entities.currency
    }),
    {
        loadHistory: CurrenciesActions.getHistory,
        loadHistoryCE: CurrenciesActions.getHistoryCError,
        redirect: RedirectActions.redirect
    }
)(StoreAddPage)

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
                            <th>Course</th>
                        </tr>
                        <tr>
                            <td>18d3</td>
                            <td>John Doe</td>
                            <td>11-7-2014</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <pre>
                    {JSON.stringify(currencyHistory, null, 4)}
                </pre>
                <LoadingOverlay loading={currencyHistoryPagination.isFetching}/>
            </div>
        )
    }
}


export default connect(
    (state)=>({
        currencyHistoryPagination: state.pagination.currencyHistory,
        currencyHistory: state.pagination.currencyHistory.result
    }),
    {
        loadHistory: CurrenciesActions.getHistory,
        loadHistoryCE: CurrenciesActions.getHistoryCError,
        redirect: RedirectActions.redirect
    }
)(StoreAddPage)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import {RedirectActions, CurrenciesActions, DictionaryActions} from '../../actions/index'
import Alert, {TYPE_ERROR} from '../../components/Alert'
import LoadingOverlay from '../../components/LoadingOverlay'
import moment from 'moment'
import {changeHandlerMixin} from '../../mixins/index'

@changeHandlerMixin
class FilterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: {
                fromDate: null,
                tillDate: null,
                fromCurrency: null,
                toCurrency: null
            }
        };
        this.filterHandler = this.changeHandler(this)('filters');
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.state.filters);
    }

    render() {
        const { filters } = this.state;
        return (
            <form className="row form-group" onSubmit={this.onSubmit}>
                <div className="col-sm-10">
                    <div className="row">
                        <div className="col-sm-3">
                            <input type="text" className="form-control" value={filters.fromDate}
                                   onChange={this.filterHandler('fromDate')}/>
                        </div>
                        <div className="col-sm-3">
                            <input type="text" className="form-control" value={filters.tillDate}
                                   onChange={this.filterHandler('tillDate')}/>
                        </div>
                        <div className="col-sm-3">
                            <input type="text" className="form-control" value={filters.fromCurrency}
                                   onChange={this.filterHandler('fromCurrency')}/>
                        </div>
                        <div className="col-sm-3">
                            <input type="text" className="form-control" value={filters.toCurrency}
                                   onChange={this.filterHandler('toCurrency')}/>
                        </div>
                    </div>
                </div>
                <div className="col-sm-2">
                    <button type="submit" className="btn btn-block btn-success btn-flat">Filter</button>
                </div>
            </form>
        )
    }
}

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
        const {loadHistory} = this.props;


        function renderMe() {
            return currencyHistoryPagination.ids.map((id, i) => {
                return (
                    <tr key={i}>
                        <td>{moment(currencyHistory[id].commitTime).format("YYYY-MM-DD HH:ss")}</td>
                        <td>{currencyHistory[id].fromCurrency}/{currencyHistory[id].toCurrency}</td>
                        <td>{currencyHistory[id].rate}</td>
                    </tr>
                )
            })
        }

        return (
            <div className="box">
                <div className="box-header with-border">
                    <h1 className="box-title">Currency courses</h1>
                </div>
                <div className="box-body">
                    <FilterForm onSubmit={loadHistory}/>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <tbody>
                            <tr>
                                <th>Date</th>
                                <th>Currency</th>
                                <th>Rate</th>
                            </tr>
                            {
                                renderMe()
                                /*TODO move date format to separate config file */
                            }
                            </tbody>
                        </table>
                    </div>
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

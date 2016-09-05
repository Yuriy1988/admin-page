import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import * as UserActions from './../../actions/user'
import LoadingOverlay from '../../components/LoadingOverlay';
import ReactChart from '../../components/ReactChart'
import {Pagination} from 'react-bootstrap';
import Alert, {TYPE_INFO, TYPE_ERROR} from '../../components/Alert'
import * as StoresActions from './../../actions/stores'
import getChartStats from './../../actions/statisticActions';

class Statistic extends Component {
    constructor(props) {
        super(props);
        this.offset = '';
        this.getValues = this.getValues.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.displayStatistic = false;
        this.query = '';
        this.orderBy = 'created';
        this.state = {
            activePage: 1
        };
        this.incorrectValues = false;
        this.errorMessage = '';
        this.state = {
            chartOptions: ['currency', 'paysys','status','store'],
            selectedOption: 'currency'
        }
    }

    componentDidMount() {
        $('.calendar-from').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true
        });
        $('.calendar-till').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true
        });
        this.props.getAllStores();
        this.getValues();
        this.props.getChartStats(this.state.selectedOption, this.query);
    }

    componentWillUnmount() {
        this.props.clearStatistic();
    }

    getValues(e) {
        const {getAdminStatistic} = this.props;
        let storeId, currency, fromPrice, tillPrice, paysysId, status, orderBy, limit, offset, query, score;
        var fromDate, tillDate;
        let $fromPrice = $('.paymentFrom-input');
        let $tillPrice = $('.paymentTill-input');
        let $moneyAmount1 = $('.moneyAmount1');
        let $moneyAmount2 = $('.moneyAmount2');
        let $calendar = $('.calendar-place-holder');
        let $storeId = $('.store-id-input').find('option:selected');
        let $currency = $('.currency-input');
        let $paysysId = $('.paysyss-id-input');
        let $status = $('.status-input');
        let $calendarFrom = $('.calendar-from');
        let $calendarTill = $('.calendar-till');
        let paymentFromVal = $('.paymentFrom-input').val();
        let paymentTillVal = $('.paymentTill-input').val();
        let correctDates;

        storeId = $storeId.attr('name') ? `store_id=${$storeId.attr('name')}` : '';
        currency = $currency.val() ? `&currency=${$currency.val()}` : '';
        fromPrice = $fromPrice.val().replace(',', '.') ? `&from_total_price=${+$fromPrice.val().replace(',', '.')}` : '';
        tillPrice = $tillPrice.val().replace(',', '.') ? `&till_total_price=${+$tillPrice.val().replace(',', '.')}` : '';
        paysysId = ($paysysId.val()).replace(' ', '_') ? `&paysys_id=${($paysysId.val()).replace(' ', '_')}` : '';
        status = ($status.val()).replace(' ', '_').toUpperCase() ? `&status=${($status.val()).replace(' ', '_').toUpperCase()}` : '';

        orderBy = `&order_by=${this.orderBy}`;
        limit = `&limit=10`;

        if (e) {
            offset = '';
            this.setState({activePage: 1})
        } else {
            offset = this.offset;
        }

        function checkCorrectDates() {

            let fromDateVal = moment($calendarFrom.val(), 'MM/DD/YYYY').format('YYYY-MM-DD');
            let tillDateVal = moment($calendarTill.val(), 'MM/DD/YYYY').format('YYYY-MM-DD');
            let result;
            if ($calendarFrom.val() === '') {
                fromDate = '';
                fromDateVal = '';
            } else {
                fromDate = `&from_date=${fromDateVal}`
            }
            if ($calendarTill.val() === '') {
                tillDate = '';
            } else {
                tillDate = `&till_date=${tillDateVal}`
            }

            if (fromDate === '&from_date=Invalid date' || tillDate === '&till_date=Invalid date'
                || tillDateVal < fromDateVal) {
                $calendar.addClass('has-error');
                fromDate = '';
                result = false;
            } else {
                $calendar.removeClass('has-error');
                result = true;
            }
            return result;
        }

        correctDates = checkCorrectDates();

        function isAccurateAmount() {
            if (paymentFromVal === '' || paymentTillVal === '' ||
                (+paymentFromVal <= +paymentTillVal && isFinite(+paymentFromVal)
                && isFinite(+paymentTillVal))) {
                $moneyAmount1.removeClass('has-error');
                $moneyAmount2.removeClass('has-error');
                return true;
            } else {
                $moneyAmount1.addClass('form-group has-feedback has-error');
                $moneyAmount2.addClass('form-group has-feedback has-error');
                return false;
            }
        }

        query = `&${storeId}${currency}${fromPrice}${tillPrice}${paysysId}${status}${fromDate}${tillDate}${orderBy}${limit}${offset}`;


        this.query = `${storeId}${currency}${fromPrice}${tillPrice}${paysysId}${status}${fromDate}${tillDate}`;

        if (isAccurateAmount() && correctDates) {
            this.errorMessage = '';
            this.incorrectValues = false;

            this.props.getChartStats(this.state.selectedOption, this.query);
            getAdminStatistic(query);
        } else {
            this.incorrectValues = true;
            this.errorMessage = 'You have entered incorrect data';
        }
    }

    setFilter(e) {
        const directSorting = $(e.currentTarget).find('.fa-sort-desc').length ? false : true;
        const $current = $(e.currentTarget);

        Array.prototype.forEach.call(document.getElementsByClassName('fa-sort-desc'), function (item) {
            item.className = 'fa fa-sort';
        });

        Array.prototype.forEach.call(document.getElementsByClassName('fa-sort-asc'), function (item) {
            item.className = 'fa fa-sort';
        });
        if (!directSorting) {
            $current.find('.fa-sort').attr('class', 'fa fa-sort-asc');
            this.orderBy = '-' + e.currentTarget.getAttribute("data");
        } else {
            $current.find('.fa-sort').attr('class', 'fa fa-sort-desc');
            this.orderBy = e.currentTarget.getAttribute("data");
        }
        this.getValues(true);
    }

    handleSelect(eventKey) {
        let {activePage} = this.state;
        if (activePage !== eventKey) {
            this.setState({activePage: eventKey});
            this.offset = ('&offset=' + (eventKey - 1) * 10) || '';
            this.getValues();
        }
    }

    onChangeStatHandler(e) {
        this.setState({selectedOption: e.target.value});
        this.props.getChartStats(e.target.value, this.query);
    }

    render() {
        const isFetching = this.props.isFetching;
        const filterElem = <i className="fa fa-sort" aria-hidden="true"></i>;
        const defaultElem = <i className="fa fa-sort-desc" aria-hidden="true"></i>;
        const statistic = this.props.statistic.payments;
        this.displayStatistic = statistic.length ? true : false;
        let style = {};
        // style.display = this.displayStatistic && !this.incorrectValues ? 'block' : 'none';

        let paginationStyle = {};
        let displayedPages = Math.ceil(this.props.statistic.totalCount / 10);
        paginationStyle.display = displayedPages > 1 ? 'block' : 'none';
        let infoMessage = statistic.length === 0 && !isFetching ? 'Nothing to display' : '';

        return  (
            <div className="statistic">
                <div className="col-sm-2 calendar-place-holder">
                    <span style={{'whiteSpace': 'nowrap'}}>Select date </span>
                    <div className="input-group">
                        <div className="input-group-addon">
                            <i className="fa fa-calendar"/>
                        </div>
                        <input type="text" className="form-control calendar-from" placeholder="from"/>
                        <input type="text" className="form-control calendar-till" placeholder="till"/>
                    </div>
                </div>
                <div className="col-sm-6">
                    <span style={{'whiteSpace': 'nowrap'}}>Store Name </span>
                    <select className="form-control store-id-input">
                        <option name=""></option>
                        {this.props.allStores.stores.map(function (item, i) {
                           return  <option name={item.id} key={i}> {item.storeName} </option>
                        })}
                    </select>
                </div>

                <div className="col-sm-2">
                    <span style={{'whiteSpace': 'nowrap'}}>Payment account</span>
                    <input type="text" className="form-control payment-account-input"/>
                </div>

                <div className="col-sm-2">
                    <span style={{'whiteSpace': 'nowrap'}}>Select currency</span>
                    <select className="form-control currency-input">
                        <option></option>
                        <option>UAH</option>
                        <option>RUB</option>
                        <option>USD</option>
                        <option>EUR</option>
                    </select>
                </div>

                <div className="col-sm-2">
                    <span style={{'whiteSpace': 'nowrap'}}>Select pay system</span>
                    <select className="form-control paysyss-id-input">
                        <option></option>
                        <option>PAY PAL</option>
                        <option>BIT COIN</option>
                        <option>VISA MASTER</option>
                    </select>
                </div>

                <div className="col-sm-2">
                    <span style={{'whiteSpace': 'nowrap'}}>Select payment status</span>
                    <select className="form-control status-input">
                        <option></option>
                        <option>Created</option>
                        <option>Accepted</option>
                        <option>Success</option>
                        <option>3D secure</option>
                        <option>Processed</option>
                        <option>Rejected</option>
                    </select>
                </div>

                <div className="col-sm-2 moneyAmount1">
                    <span style={{'whiteSpace': 'nowrap'}}>Amount from</span>
                    <input type="text" className="form-control paymentFrom-input"/>
                </div>

                <div className="col-sm-2 moneyAmount2">
                    <div>
                        <span style={{'whiteSpace': 'nowrap'}}>Amount till</span>
                        <input type="text" className="form-control paymentTill-input"/>
                    </div>
                </div>

                <button className="getStat btn btn-success" style={{margin: '15px'}}
                        onClick={this.getValues.bind(this)}>Get
                    statistic
                </button>
                <LoadingOverlay loading={false}/>

                <div className="holder" style={style}>
                    <div>

                        <table className="statTable table table-striped table-bordered">
                            <thead>
                            <tr className="filter">
                                <th onClick={this.setFilter.bind(this)} data="created" rowSpan="2">
                                    <span>created {defaultElem}</span></th>
                                <th onClick={this.setFilter.bind(this)} data="score" rowSpan="2">
                                    <span>Anti-fraud score {filterElem}</span></th>
                                <th onClick={this.setFilter.bind(this)} data="payment_account" rowSpan="2">
                                    payment_account {filterElem}</th>
                                <th onClick={this.setFilter.bind(this)} data="paysys_id" rowSpan="2">
                                    paysys_id {filterElem}</th>
                                <th onClick={this.setFilter.bind(this)} data="status" rowSpan="2">
                                    status {filterElem}</th>
                                <th onClick={this.setFilter.bind(this)} data="updated" rowSpan="2">
                                    updated {filterElem}</th>
                                <th colSpan="3" >invoice</th>
                            </tr>
                            <tr className="filter">
                                <th data="currency" onClick={this.setFilter.bind(this)}>currency {filterElem}</th>
                                <th data="store_id" onClick={this.setFilter.bind(this)}>store_id {filterElem}</th>
                                <th data="total_price" onClick={this.setFilter.bind(this)}>total_price {filterElem}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {statistic.map(function (result, i) {
                                return <tr key={i}>
                                    <td key={Math.random()}>{moment(result.created).format('MMMM Do YYYY')}</td>
                                    <td key={Math.random()}>{result.score}</td>
                                    <td key={Math.random()}>{result.paymentAccount}</td>
                                    <td key={Math.random()}>{result.paysysId}</td>
                                    <td key={Math.random()}>{result.status}</td>
                                    <td key={Math.random()}>{moment(result.updated).format('MMMM Do YYYY')}</td>
                                    <td key={Math.random()}>{result.invoice.currency}</td>
                                    <td key={Math.random()}>{result.invoice.storeId}</td>
                                    <td key={Math.random()}>{result.invoice.totalPrice}</td>
                                </tr>
                            })}
                            </tbody>
                        </table>
                        <div className="pagination" style={paginationStyle}>
                            <Pagination
                                prev
                                next
                                first
                                last
                                ellipsis
                                items={displayedPages || 1}
                                activePage={this.state.activePage}
                                onSelect={this.handleSelect.bind(this)}>
                            </Pagination>
                        </div>

                    </div>
                    <div className="chartStatistic">
                        <ReactChart
                            chartStatistic={this.props.chartStatistic}
                            selectedOption = {this.state.selectedOption}
                            onChangeStatHandler = {this.onChangeStatHandler.bind(this)}
                            chartOptions = {this.state.chartOptions}/>
                    </div>
                </div>
                <Alert type={TYPE_ERROR}>
                    {this.errorMessage}
                </Alert>
                <Alert type={TYPE_INFO}>
                    {infoMessage}
                </Alert>
            </div>
        )
    }
}

export default connect(
    (state)=>({
        statistic: state.user.statistic,
        chartStatistic: state.chartStatistic,
        isFetching: state.user,
        allStores: state.storeList
    }),
    {
        getAdminStatistic: UserActions.getAdminStatistic,
        clearStatistic: UserActions.clearStatistic,
        getAllStores: StoresActions.getAllStores,
        getChartStats: getChartStats
    }
)(Statistic)

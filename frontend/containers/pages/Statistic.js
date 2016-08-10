var test;
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import * as UserActions from './../../actions/user'
import LoadingOverlay from '../../components/LoadingOverlay';
import Chart from '../../components/Chart'


class Statistic extends Component {
    constructor(props) {
        super(props);
        this.currentPage = 1;
        this.maxPage = 1;
        this.offset = '';
        this.getValues = this.getValues.bind(this);
        this.pagination = this.pagination.bind(this);
        this.displayStatistic = false;
        this.firstTimeLoad = true;
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

    }
    componentWillUnmount() {
        this.props.clearStatistic();
    }


    getValues(e) {

        const {getAdminStatistic} = this.props;
        let storeId, currency, fromPrice, tillPrice, paysysId, status, fromDate, tillDate, orderBy, limit, offset, query;
        let fromPriceNode = $('.paymentFrom-input');
        let tillPriceNode = $('.paymentTill-input');
        let moneyAmount = $('.moneyAmount');

        storeId = $('.store-id-input').val() ? `store_id=${$('.store-id-input').val()}` : '';
        currency = $('.currency-input').val() ? `&currency=${$('.currency-input').val()}` : '';
        fromPrice = fromPriceNode.val().replace(',', '.') ? `&from_total_price=${+fromPriceNode.val().replace(',', '.')}` : '';
        tillPrice = tillPriceNode.val().replace(',', '.') ? `&till_total_price=${+tillPriceNode.val().replace(',', '.')}` : '';
        paysysId = ($('.paysyss-id-input').val()).replace(' ', '_') ? `&paysys_id=${($('.paysyss-id-input').val()).replace(' ', '_')}` : '';
        status = ($('.status-input').val()).replace(' ', '_').toUpperCase() ? `&status=${($('.status-input').val()).replace(' ', '_').toUpperCase()}` : '';
        fromDate = moment($('.calendar-from').val(), 'MM/DD/YYYY').format('YYYY-MM-DD') ? `&from_date=${moment($('.calendar-from').val(), 'MM/DD/YYYY').format('YYYY-MM-DD')}` : '';
        tillDate = moment($('.calendar-till').val(), 'MM/DD/YYYY').format('YYYY-MM-DD') ? `&till_date=${moment($('.calendar-till').val(), 'MM/DD/YYYY').format('YYYY-MM-DD')}` : '';

        if (fromDate === '&from_date=Invalid date') {
            fromDate = '';
        }
        if (tillDate === '&till_date=Invalid date') {
            tillDate = '';
        }

        orderBy = ''; //todo &order_by=
        limit = `&limit=10`;
        if (e) {
            offset = ''
        } else {
            offset = $('ul .active').text() ? '&offset=' + (+$('ul .active').text() - 1) * 10 : '';
        }

        function isAccurate() {
            if ($('.paymentFrom-input').val() === '' || $('.paymentTill-input').val() === '' ||
                ($('.paymentFrom-input').val() <= $('.paymentTill-input').val() && isFinite(+$('.paymentFrom-input').val())
                && isFinite(+$('.paymentTill-input').val()))) {
                moneyAmount.removeClass('has-error');
                return true;
            } else {
                moneyAmount.addClass('form-group has-feedback has-error');
                return false;
            }
        }

        query = `${storeId}${currency}${fromPrice}${tillPrice}${paysysId}${status}${fromDate}${tillDate}${orderBy}${limit}${offset}`;
        if (isAccurate()) {
            getAdminStatistic(query);
        }
        if (e && !this.firstTimeLoad) {
            $('.pagination').remove();
            $('.pagination-holder').append($("<div class='pagination'></div>"));
            this.pagination();
        }
        this.firstTimeLoad = false;
    }

    pagination() {
        let info = this.props.statistic;
        this.maxPage = Math.ceil(info.totalCount / 10 - 1) || 1;
        let visiblePages = 1;
        if (this.maxPage > 3) {
            visiblePages = 3;
        } else {
            visiblePages = 1;
        }
        let pageNum = 0;
        let self = this;
        $('.pagination').twbsPagination({
            totalPages: this.maxPage,
            visiblePages,
            onPageClick: function (event, page) {
                pageNum = page;
                setTimeout(function () {
                    self.getValues();
                }, 1)
            }
        });
    }

    render() {
        console.log('rendered');
        const statistic = this.props.statistic.payments;
        this.displayStatistic = statistic.length ? true : false;

        let style = {};
        style.display = this.displayStatistic ? 'block' : 'none';

        this.pagination();

        return (
            <div className="statistic">
                <div className="col-sm-2">
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
                    <span style={{'whiteSpace': 'nowrap'}}>Store id </span>
                    <div className="input-group">
                        <div className="input-group-addon">
                            <i className="fa fa-shopping-cart"/>
                        </div>
                        <input ref="input" type="text" className="form-control store-id-input"/>
                    </div>
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

                <div className="col-sm-2 moneyAmount">
                    <span style={{'whiteSpace': 'nowrap'}}>Payment from</span>
                    <input type="text" className="form-control paymentFrom-input"/>
                    <div>
                        <span style={{'whiteSpace': 'nowrap'}}>Payment till</span>
                        <input type="text" className="form-control paymentTill-input"/>
                    </div>
                </div>

                <button className="btn btn-success" style={{margin: '15px'}} onClick={this.getValues.bind(this)}>Get
                    statistic
                </button>
                <LoadingOverlay loading={false}/>

                <div className="holder" style={style}>
                    <div>
                        {/*statistic result table starts here*/}
                        <table className="statTable table table-striped table-bordered">
                            <thead>
                            <tr>
                                <th rowSpan="2">created</th>
                                <th rowSpan="2">payment_account</th>
                                <th rowSpan="2">paysys_id</th>
                                <th rowSpan="2">status</th>
                                <th rowSpan="2">updated</th>
                                <th colSpan="3">invoice</th>
                            </tr>
                            <tr>
                                <th>currency</th>
                                <th>store_id</th>
                                <th>total_price</th>
                            </tr>
                            </thead>
                            <tbody>
                            {statistic.map(function (result, i) {
                                return <tr key={i}>
                                    <td key={Math.random()}>{moment(result.created).format('MMMM Do YYYY')}</td>
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
                        <div className="pagination-holder">
                            <div className="pagination">
                            </div>
                        </div>
                    </div>

                    <Chart statistic/>
                </div>
            </div>
        )
    }
}

export default connect(
    (state)=>({
        statistic: state.user.statistic
    }),
    {getAdminStatistic: UserActions.getAdminStatistic,
        clearStatistic: UserActions.clearStatistic}
)(Statistic)

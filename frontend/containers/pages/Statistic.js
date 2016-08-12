import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import * as UserActions from './../../actions/user'
import LoadingOverlay from '../../components/LoadingOverlay';
import ReactChart from '../../components/ReactChart'

class Statistic extends Component {
    constructor(props) {
        super(props);
        this.currentPage = 1;
        this.maxPage = 1;
        this.offset = '';
        this.getValues = this.getValues.bind(this);
        this.pagination = this.pagination.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.displayStatistic = false;
        this.orderBy = 'created';
        this.trigered = false;
    }

    componentWillReceiveProps(nextprops) {
        if (nextprops.statistic) {
            if (this.props.statistic !== nextprops.statistic) {
                this.pagination(nextprops);
            }
        }
        $('.filter').click(function() {
            $( ".pagination .first" ).trigger( "click" );
        });
        $('.getStat').click(function() {
            $( ".pagination .first" ).trigger( "click" );
        });
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
        let moneyAmount1 = $('.moneyAmount1');
        let moneyAmount2 = $('.moneyAmount2');

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

        orderBy = `&order_by=${this.orderBy}`;
        limit = `&limit=10`;
        if (e) {
            offset = ''
        } else {
            offset = $('ul .active').text() ? '&offset=' + (+$('ul .active').text() - 1) * 10 : '';
        }

        function isAccurate() {
            if ($('.paymentFrom-input').val() === '' || $('.paymentTill-input').val() === '' ||
                (+$('.paymentFrom-input').val() <= +$('.paymentTill-input').val() && isFinite(+$('.paymentFrom-input').val())
                && isFinite(+$('.paymentTill-input').val()))) {
                moneyAmount1.removeClass('has-error');
                moneyAmount2.removeClass('has-error');
                return true;
            } else {
                moneyAmount1.addClass('form-group has-feedback has-error');
                moneyAmount2.addClass('form-group has-feedback has-error');
                return false;
            }
        }

        query = `${storeId}${currency}${fromPrice}${tillPrice}${paysysId}${status}${fromDate}${tillDate}${orderBy}${limit}${offset}`;
        if (isAccurate()) {
            getAdminStatistic(query);
        }

        $('.getStat').click(function() {
            $( ".pagination .first" ).trigger( "click" );
        });
    }

    setFilter(e) {
        debugger;
        document.getElementsByClassName('fa-sort-desc').forEach = Array.prototype.forEach;
        document.getElementsByClassName('fa-sort-desc').forEach(function(item) {
            item.className = 'fa fa-sort';
        });
        $(e.currentTarget).find('.fa-sort').attr('class', 'fa fa-sort-desc');
        this.orderBy = e.currentTarget.getAttribute("data");
        this.getValues();
    }

    pagination(props) {
        if (!props) return;
        let info = props.statistic;

        if (!info.totalCount) {
            return;
        }
        this.maxPage = Math.ceil(info.totalCount / 10 - 1) || 1;
        let visiblePages = 1;

        if (this.maxPage === 2) {
            visiblePages = 2;
        } else if (this.maxPage >= 3) {
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
                self.getValues();
            }
        });
    }

    render() {
        const filterElem = <i className="fa fa-sort" aria-hidden="true"></i>;
        const defaultElem = <i className="fa fa-sort-desc" aria-hidden="true"></i>;
        const statistic = this.props.statistic.payments;
        this.displayStatistic = statistic.length ? true : false;

        let style = {};
        style.display = this.displayStatistic ? 'block' : 'none';

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


                <button className="getStat btn btn-success" style={{margin: '15px'}} onClick={this.getValues.bind(this)}>Get
                    statistic
                </button>
                <LoadingOverlay loading={false}/>

                <div className="holder" style={style}>
                    <div>
                        {/*statistic result table starts here*/}
                        <table className="statTable table table-striped table-bordered">
                            <thead>
                            <tr className="filter">
                                <th onClick={this.setFilter.bind(this)} data="created" rowSpan="2"><span>created {defaultElem}</span></th>
                                <th onClick={this.setFilter.bind(this)} data="payment_account" rowSpan="2">payment_account {filterElem}</th>
                                <th onClick={this.setFilter.bind(this)} data="paysys_id" rowSpan="2">paysys_id {filterElem}</th>
                                <th onClick={this.setFilter.bind(this)} data="status" rowSpan="2">status {filterElem}</th>
                                <th onClick={this.setFilter.bind(this)} data="updated" rowSpan="2">updated {filterElem}</th>
                                <th onClick={this.setFilter.bind(this)} colSpan="3">invoice</th>
                            </tr>
                            <tr  className="filter">
                                <th data="currency" onClick={this.setFilter.bind(this)}>currency {filterElem}</th>
                                <th data="store_id" onClick={this.setFilter.bind(this)}>store_id {filterElem}</th>
                                <th data="total_price" onClick={this.setFilter.bind(this)}>total_price {filterElem}</th>
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
                    <div className="chartStatistic">
                        <ReactChart data={statistic}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    (state)=>({
        statistic: state.user.statistic
    }),
    {
        getAdminStatistic: UserActions.getAdminStatistic,
        clearStatistic: UserActions.clearStatistic
    }
)(Statistic)

var test;
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import * as UserActions from './../../actions/user'
import LoadingOverlay from '../../components/LoadingOverlay';
import Chart from '../../components/Chart'


class Statistic extends Component {
    constructor(props) {
        super(props);
        this.getValues = this.getValues.bind(this);
    }

    componentDidMount() {
        $('.calendar-from').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true
        });
        $('.calendar-till').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true
        })
    }

    getValues() {

        const {getAdminStatistic} = this.props;
        let storeId, currency, fromPrice, tillPrice, paysysId, status, fromDate, tillDate, orderBy, limit, offset, query;
        let fromPriceNode = $('.paymentFrom-input');
        let tillPriceNode = $('.paymentTill-input');
        let moneyAmount = $('.moneyAmount');

        storeId = $('.store-id-input').val()? `store_id=${$('.store-id-input').val()}` : '';
        currency = $('.currency-input').val()? `&currency=${$('.currency-input').val()}`: '';
        fromPrice = fromPriceNode.val().replace(',', '.')? `&from_total_price=${+fromPriceNode.val().replace(',', '.')}` : '';
        tillPrice = tillPriceNode.val().replace(',', '.')? `&till_total_price=${+tillPriceNode.val().replace(',', '.')}` : '';
        paysysId = ($('.paysyss-id-input').val()).replace(' ', '_')? `&paysys_id=${($('.paysyss-id-input').val()).replace(' ', '_')}` : '';
        status = ($('.status-input').val()).replace(' ', '_').toUpperCase()? `&status=${($('.status-input').val()).replace(' ', '_').toUpperCase()}`:'';
        fromDate = moment($('.calendar-from').val(), 'MM/DD/YYYY').format('YYYY-MM-DD')? `&from_date=${moment($('.calendar-from').val(), 'MM/DD/YYYY').format('YYYY-MM-DD')}` : '';
        tillDate = moment($('.calendar-till').val(), 'MM/DD/YYYY').format('YYYY-MM-DD')? `&till_date=${moment($('.calendar-till').val(), 'MM/DD/YYYY').format('YYYY-MM-DD')}` : '';

        if (fromDate  === '&from_date=Invalid date') {
            fromDate = '';
        }
        if (tillDate === '&till_date=Invalid date') {
            tillDate = '';
        }

        orderBy = ''; //todo &order_by=
        limit = ''; //todo &limit=
        offset = ''; //todo &offset=

        function isAccurate() {
            if ($('.paymentFrom-input').val() === '' || $('.paymentTill-input').val() ==='' ||
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
    }

    render() {
        return (
            <div>
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
                <div className="col-sm-2">
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
            </div>
        )
    }
}


export default connect(
    (state)=>({
        stores: state.entities.stores,
        storePagination: state.pagination.store
    }),
    {getAdminStatistic: UserActions.getAdminStatistic}
)(Statistic)
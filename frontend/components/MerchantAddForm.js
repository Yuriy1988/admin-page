import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class MerchantAddForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="box">
                <div className="box-header with-border">
                    <h3 className="box-title" >Merchant registration</h3>
                    {/*<!-- ngIf: actionType == 'create' --><h3 ng-if="actionType == 'create'" className="box-title ng-scope" x-translate="">Merchant registration</h3><!-- end ngIf: actionType == 'create' -->
                    <!-- ngIf: actionType == 'edit' -->*/}
                </div>
                <div className="box-body">
                    <div className="row">
                        <div className="col-xs-6">
                            <label htmlFor="name" >Merchant name</label>
                            {/*
                            <div ng-className="{'has-error': errors.name, 'form-group': true}" className="form-group">
                                <input type="text" className="has-error form-control ng-pristine ng-untouched ng-valid" id="name" placeholder="Please, insert merchant name" ng-model="merchant.name">
                            </div>*/}
                        </div>
                        <div className="col-xs-12">
                            <h3 >Main information</h3>
                        </div>
                        <div className="col-xs-3">
                            <div className="form-group">
                                <label htmlFor="name" >Chairman</label>
                                <input type="text" className="form-control " id="directorName" placeholder="ФИО директора" />
                            </div>
                        </div>
                        <div className="col-xs-3">
                            <label htmlFor="name">Email</label>
                            {/*
                            <!-- ngIf: errors['merchantInfo.email'] -->*/}
                            <div className="form-group has-error">
                                <input type="text" className="form-control" id="email" placeholder="Email" />
                            </div>
                        </div>
                        <div className="col-xs-3">
                            <label htmlFor="name" >Phone</label>
                            {/*<!-- ngIf: errors['merchantInfo.phone'] -->*/}
                            <div className="form-group">
                                <input type="text" className="form-control" id="phone" placeholder="Phone" />
                            </div>
                        </div>
                        <div className="col-xs-3">
                            <div className="form-group">
                                <label htmlFor="name" >Address</label>
                                <input type="text" className="form-control" id="address" placeholder="Адрес" />
                            </div>
                        </div>

                        <div className="col-xs-12">
                            <h3 x-translate="" className="ng-scope">Merchant account</h3>
                        </div>
                        <div className="col-xs-4">
                            <div className="form-group">
                                <label htmlFor="name" >Checking Account</label>
                                <input type="text" className="form-control " id="checkingAccount" placeholder="Checking Account" />
                            </div>
                        </div>
                        <div className="col-xs-4">
                            <div className="form-group">
                                <label htmlFor="name">MFO</label>
                                <input type="text" className="form-control " id="mfo" placeholder="MFO" n/>
                            </div>
                        </div>
                        <div className="col-xs-4">
                            <div className="form-group">
                                <label htmlFor="name" >ОКПО</label>
                                <input type="text" className="form-control " id="okpo" placeholder="ОКПО" />
                            </div>
                        </div>
                        <div className="col-xs-6">
                            <div className="form-group">
                                <label htmlFor="name">Bank Name</label>
                                <input type="text" className="form-control " id="bankName" placeholder="Bank Name" />
                            </div>
                        </div>
                        <div className="col-xs-6">
                            <div className="form-group">
                                <label htmlFor="currency">Currency</label>
                                <select className="form-control " id="currency" data-tags="true" ><option selected="selected">USD</option></select>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="box-footer clearfix">
                    <div className="pull-right">
                        <button className="btn btn-success " >Save</button>
                        <a className="btn btn-default" >Cancel</a>
                    </div>
                </div>
            </div>
        )
    }
}


export default connect()(MerchantAddForm)

import React from 'react'

const AddMerchants = React.createClass({
  render() {
    return (
    	<section className="content">
				<div className="row ng-scope">
    			<div className="col-xs-12">
        		<div className="box">
            	<div className="box-header">
                <h3 className="box-title ng-scope" >Merchant registration</h3>     
            	</div>
            <div className="box-body">
               <div className="row">
                  <div className="col-xs-6">
                      <label forName="name">Merchant name</label>

                      <div className="form-group">
                          <input type="text" className="has-error form-control" id="name" placeholder="Please, insert merchant name"/>
                      </div>
                  </div>
                  <div className="col-xs-12">
                      <h3>Main information</h3>
                  </div>
                  <div className="col-xs-3">
                      <div className="form-group">
                          <label forName="name">Chairman</label>
                          <input type="text" className="form-control" id="directorName" placeholder="ФИО директора"/>
                      </div>
                  </div>
                  <div className="col-xs-3">
                      <label forName="name">Email</label>

                      <div className="form-group">
                          <input type="text" className="form-control" id="email" placeholder="Email"/>
                      </div>
                  </div>
                  <div className="col-xs-3">
                      <label forName="name">Phone</label>

                      <div className="form-group">
                          <input type="text" className="form-control" id="phone" placeholder="Phone"/>
                      </div>
                  </div>
                  <div className="col-xs-3">
                      <div className="form-group">
                          <label forName="name">Address</label>
                          <input type="text" className="form-control" id="address" placeholder="Адрес"/>
                      </div>
                  </div>

                  <div className="col-xs-12">
                      <h3>Merchant account</h3>
                  </div>
                  <div className="col-xs-4">
                      <div className="form-group">
                          <label forName="name">Checking Account</label>
                          <input type="text" className="form-control" id="checkingAccount" placeholder="Checking Account"/>
                      </div>
                  </div>
                  <div className="col-xs-4">
                      <div className="form-group">
                          <label forName="name">MFO</label>
                          <input type="text" className="form-control" id="mfo" placeholder="MFO"/>
                      </div>
                  </div>
                  <div className="col-xs-4">
                      <div className="form-group">
                          <label forName="name">ОКПО</label>
                          <input type="text" className="form-control" id="okpo" placeholder="ОКПО"/>
                      </div>
                  </div>
                  <div className="col-xs-6">
                      <div className="form-group">
                          <label forName="name">Bank Name</label>
                          <input type="text" className="form-control" id="bankName" placeholder="Bank Name"/>
                      </div>
                  </div>
                  <div className="col-xs-6">
                      <div className="form-group">
                          <label forName="currency">Currency</label>
                          <select defaultValue="USD" className="form-control" id="currency">
                          	<option label="EUR" value="EUR">EUR</option>
                          	<option label="RUR" value="RUR">RUR</option>
                          	<option label="UAH" value="UAH">UAH</option>
                          	<option label="USD" value="USD">USD</option>
                          </select>
                      </div>
                  </div>
                </div>
            </div>
            	<div className="box-footer clearfix">
                	<div className="pull-right">
                    <button className="btn btn-success">Save</button>
                    <a className="btn btn-default" href="#/">Cancel</a>
                	</div>
            	</div>
        		</div>
    			</div>
				</div>
			</section>
    )
  }
})

export default AddMerchants
//11:<!-- end ngIf: actionType == 'create' --> 
//11:<!-- ngIf: actionType == 'create' -->
//12: <!-- ngIf: actionType == 'edit' -->
//18:                         <!-- ngIf: errors.name -->
//34:                         <!-- ngIf: errors['merchantInfo.email'] -->
//41:                         <!-- ngIf: errors['merchantInfo.phone'] -->
// 93: <!-- ngIf: actionType == 'edit' --> <!-- end ngIf: actionType == 'create' -->
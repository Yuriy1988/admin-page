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
                    <h3 className="box-title" >Merchants</h3>
                    {/*<!-- ngIf: actionType == 'create' --><h3 ng-if="actionType == 'create'" className="box-title ng-scope" x-translate="">Merchant registration</h3><!-- end ngIf: actionType == 'create' -->
                    <!-- ngIf: actionType == 'edit' -->*/}
                </div>
                <div className="box-body">
                    <p>TODO list of merchants</p>
                </div>
            </div>
        )
    }
}


export default connect()(MerchantAddForm)

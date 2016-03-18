import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { RedirectActions, MerchantActions } from '../../actions/index'

import MerchantForm from '../../components/forms/MerchantForm'
import LoadingOverlay from '../../components/LoadingOverlay'
import Alert, { TYPE_ERROR } from '../../components/Alert'

class MerchantAddPage extends Component {

    constructor(props) {
        super(props);
        this.onCreate = this.onCreate.bind(this);
    }

    onCreate(merchant) {
        const { create } = this.props;
        create(merchant);
    }

    render() {
        const { createRequest, createCE, redirect } = this.props;

        if (!!createRequest.result) {
            redirect(`/admin/administrator/merchants/${createRequest.result}`, true);
        }

        let errors = {};
        try {
            errors = createRequest.error.serverError.errors;
        } catch (e) {
        }

        let errorMsg = null;
        if (createRequest.error) {
            errorMsg = createRequest.error.serverError.message;
        }

        return (
            <div>
                <Alert type={TYPE_ERROR} handleClose={createCE}>{errorMsg}</Alert>
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">Creating Merchant</h3>
                    </div>
                    <div className="box-body">
                        <MerchantForm onSubmit={this.onCreate} errors={errors}/>
                    </div>
                    <LoadingOverlay loading={createRequest.isFetching}/>
                </div>
            </div>
        )
    }
}


export default connect(
    (state)=>({
        createRequest: state.pagination.merchantCreate
    }),
    {
        cancel: RedirectActions.back,
        create: MerchantActions.create,
        redirect: RedirectActions.redirect,
        createCE: MerchantActions.createCError
    }
)(MerchantAddPage)

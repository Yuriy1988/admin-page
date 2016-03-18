import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { RedirectActions, MerchantActions } from '../../actions/index'

import MerchantForm from '../../components/forms/MerchantForm'
import LoadingOverlay from '../../components/LoadingOverlay'
import Alert, { TYPE_ERROR } from '../../components/Alert'

class MerchantEditPage extends Component {

    constructor(props) {
        super(props);
        this.onEdit = this.onEdit.bind(this);
        this.loadData = this.loadData.bind(this);

        this.loadData();
    }

    componentWillReceiveProps(props) {
        const { editRequest, redirect } = props;

        if (!!editRequest.result) {
            redirect(`/admin/administrator/merchants/${editRequest.result}`, true);
        }
    }

    loadData() {
        const { loadMerchant } = this.props;
        const { merchantId } = this.props.params;
        loadMerchant(merchantId);
    }

    onEdit(merchant) {
        const { edit } = this.props;
        const { merchantId } = this.props.params;
        edit(merchantId, merchant);
    }

    render() {
        const { editRequest, editCE } = this.props;
        const { getRequest, loadMerchantCE } = this.props;
        const { merchants } = this.props;


        let errors = {};
        try {
            errors = editRequest.error.serverError.errors;
        } catch (e) {
        }

        let errorEdit = null;
        if (editRequest.error) {
            errorEdit = editRequest.error.serverError.message;
        }

        let errorGet = null;
        if (getRequest.error) {
            errorGet = getRequest.error.serverError.message;
        }

        let merchant = null;
        if (getRequest.result) {
            const merchantId = getRequest.result;
            if (merchants[merchantId]) {
                merchant = merchants[merchantId];
            }
        }

        const merchantForm = (merchant) ? <MerchantForm onSubmit={this.onEdit} errors={errors} initMerchant={merchant}/> : null;
        return (
            <div>
                <Alert type={TYPE_ERROR} handleClose={editCE}>{errorEdit}</Alert>
                <Alert type={TYPE_ERROR} handleClose={loadMerchantCE}>{errorGet}</Alert>
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">Edit merchant</h3>
                    </div>
                    <div className="box-body">
                        {merchantForm}
                    </div>
                    <LoadingOverlay loading={editRequest.isFetching || getRequest.isFetching}/>
                </div>
            </div>
        )
    }
}


export default connect(
    (state)=>({
        editRequest: state.pagination.merchantEdit,
        getRequest: state.pagination.merchant,
        merchants: state.entities.merchants
    }),
    {
        loadMerchant: MerchantActions.getById,
        loadStoreCE: MerchantActions.getByIdCError,
        cancel: RedirectActions.back,
        redirect: RedirectActions.redirect,
        edit: MerchantActions.editById,
        editCE: MerchantActions.editByIdCError
    }
)(MerchantEditPage)

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { RedirectActions, MerchantContractActions, PaginationActions } from '../../actions/index'

import MerchantContractForm from '../../components/forms/MerchantContractForm'
import LoadingOverlay from '../../components/LoadingOverlay'
import Alert, { TYPE_ERROR } from '../../components/Alert'

class MerchantContractAddPage extends Component {

    constructor(props) {
        super(props);
        this.onCreate = this.onCreate.bind(this);
    }

    onCreate(contract) {
        const { create } = this.props;
        const { merchantId } = this.props.params;
        create(merchantId, contract);
    }

    componentWillReceiveProps(props) {
        const { createRequest, clearPagination, redirect } = props;
        const { merchantId } = this.props.params;
        if (!!createRequest.result) {
            redirect(`/admin/administrator/merchants/${merchantId}/contracts`);
            clearPagination("merchantContractCreate"); // TODO const
        }
    }

    componentWillUnmount() {
        const { clearPagination } = this.props;
        clearPagination("merchantContractCreate");// TODO const
    }

    componentWillMount() {
        const { clearPagination } = this.props;
        clearPagination("merchantContractCreate");// TODO const
    }

    render() {
        const { createRequest, createCE } = this.props;

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
                        <h3 className="box-title">Adding merchant contract</h3>
                    </div>
                    <div className="box-body">
                        <MerchantContractForm onSubmit={this.onCreate} errors={errors}/>
                    </div>
                    <LoadingOverlay loading={createRequest.isFetching}/>
                </div>
            </div>
        )
    }
}


export default connect(
    (state)=>({
        createRequest: state.pagination.merchantContractCreate
    }),
    {
        create: MerchantContractActions.create,
        createCE: MerchantContractActions.createCError,
        cancel: RedirectActions.back,
        redirect: RedirectActions.redirect,
        clearPagination: PaginationActions.clear
    }
)(MerchantContractAddPage)

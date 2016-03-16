import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { RedirectActions, StoreActions } from '../../actions/index'

import StoreForm from '../../components/forms/StoreForm'
import LoadingOverlay from '../../components/LoadingOverlay'
import Alert, { TYPE_ERROR } from '../../components/Alert'

class StoreAddPage extends Component {

    constructor(props) {
        super(props);
        this.onCreate = this.onCreate.bind(this);
    }

    onCreate(store) {
        const { create } = this.props;
        const { merchantId } = this.props.params;
        create(merchantId, store);
    }

    render() {
        const { createRequest, createCE, redirect } = this.props;

        if (!!createRequest.result) {
            redirect(`/admin/administrator/stores/${createRequest.result}`, true);
        }

        let errors = {};
        try {
            errors = createRequest.error.serverError.errors;
        } catch (e) {
        }

        /*if (!!storeCreatePagination.result) {
         redirect(`/admin/administrator/stores/${storeCreatePagination.result}`, true);
         }*/

        let errorMsg = null;
        if (createRequest.error) {
            errorMsg = createRequest.error.serverError.message;
        }

        return (
            <div>
                <Alert type={TYPE_ERROR} handleClose={createCE}>{errorMsg}</Alert>
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">Adding store</h3>
                    </div>
                    <div className="box-body">
                        <StoreForm onSubmit={this.onCreate} errors={errors}/>
                    </div>
                    <LoadingOverlay loading={createRequest.isFetching}/>
                </div>
            </div>
        )
    }
}


export default connect(
    (state)=>({
        createRequest: state.pagination.storeCreate
    }),
    {
        cancel: RedirectActions.back,
        create: StoreActions.create,
        redirect: RedirectActions.redirect,
        createCE: StoreActions.createCError
    }
)(StoreAddPage)

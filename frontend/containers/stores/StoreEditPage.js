import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { RedirectActions, StoreActions, PaginationActions } from '../../actions/index'

import StoreForm from '../../components/forms/StoreForm'
import LoadingOverlay from '../../components/LoadingOverlay'
import Alert, { TYPE_ERROR } from '../../components/Alert'

class StoreEditPage extends Component {

    constructor(props) {
        super(props);
        this.onEdit = this.onEdit.bind(this);
        this.loadData = this.loadData.bind(this);

        this.loadData();
    }

    componentWillReceiveProps(props) {
        const { editRequest, redirect, clearPagination} = props;

        if (!!editRequest.result) {
            redirect(`/admin/administrator/stores/${editRequest.result}`);
            clearPagination("storeEdit"); //TODO constant
            clearPagination("storeGet"); //TODO constant
        }
    }

    componentWillUnmount() {
        const { clearPagination } = this.props;
        clearPagination("storeEdit"); //TODO constant
        clearPagination("storeGet"); //TODO constant
    }

    loadData() {
        const { loadStore } = this.props;
        const { storeId } = this.props.params;
        loadStore(storeId);
    }

    onEdit(store) {
        const { edit } = this.props;
        const { storeId } = this.props.params;
        edit(storeId, store);
    }

    render() {
        const { editRequest, editCE } = this.props;
        const { getRequest, loadStoreCE } = this.props;
        const { stores } = this.props;


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

        let store = null;
        if (getRequest.result) {
            const storeId = getRequest.result;
            if (stores[storeId]) {
                store = stores[storeId];
            }
        }

        const storeForm = (store) ? <StoreForm onSubmit={this.onEdit} errors={errors} initStore={store}/> : null;
        return (
            <div>
                <Alert type={TYPE_ERROR} handleClose={editCE}>{errorEdit}</Alert>
                <Alert type={TYPE_ERROR} handleClose={loadStoreCE}>{errorGet}</Alert>
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">Edit store</h3>
                    </div>
                    <div className="box-body">
                        {storeForm}
                    </div>
                    <LoadingOverlay loading={editRequest.isFetching || getRequest.isFetching}/>
                </div>
            </div>
        )
    }
}


export default connect(
    (state)=>({
        editRequest: state.pagination.storeEdit,
        getRequest: state.pagination.store,
        stores: state.entities.stores
    }),
    {
        loadStore: StoreActions.getById,
        loadStoreCE: StoreActions.getByIdCError,
        cancel: RedirectActions.back,
        redirect: RedirectActions.redirect,
        edit: StoreActions.editById,
        editCE: StoreActions.editByIdCError,

        clearPagination: PaginationActions.clear
    }
)(StoreEditPage)

import * as ActionTypes from '../actions'
import * as MerchantActions from '../actions/merchants'
import * as StoresActions from '../actions/stores'
import {CurrenciesActions} from '../actions/index'
import merge from 'lodash/merge'
import paginate from './paginate'
import user from './user'
import dictionary from './dictionary'
import sideBar from './sideBar'
import { routeReducer } from 'react-router-redux'
import { combineReducers } from 'redux'

// Updates an entity cache in response to any action with response.entities.
function entities(state = {merchants: {}, stores: {}}, action) {
    if (!!action.response && !!action.response.entities) {
        return merge({}, state, action.response.entities);
    }
    if (!!action.deleteObject && !!action.deleteObject.entity) {
        const newState = merge({}, state);
        delete newState[action.deleteObject.entity][action.deleteObject.id];
        return newState;
    }
    return state;
}


// Updates the pagination data for different actions.
const pagination = combineReducers({
//Merchants
    merchants: paginate({
        mapActionToKey: action => "merchants",
        entity: "merchants",
        types: [
            MerchantActions.MERCHANTS_LIST_REQUEST,
            MerchantActions.MERCHANTS_LIST_SUCCESS,
            MerchantActions.MERCHANTS_LIST_FAILURE
        ],
        cError: MerchantActions.MERCHANTS_LIST_CERROR
    }),
    merchant: paginate({
        mapActionToKey: action => "merchant",
        types: [
            MerchantActions.MERCHANT_GET_REQUEST,
            MerchantActions.MERCHANT_GET_SUCCESS,
            MerchantActions.MERCHANT_GET_FAILURE
        ],
        cError: MerchantActions.MERCHANT_GET_CERROR
    }),
    merchantCreate: paginate({
        mapActionToKey: action => "merchant",
        types: [
            MerchantActions.MERCHANT_CREATE_REQUEST,
            MerchantActions.MERCHANT_CREATE_SUCCESS,
            MerchantActions.MERCHANT_CREATE_FAILURE
        ],
        cError: MerchantActions.MERCHANT_CREATE_CERROR
    }),
    merchantDelete: paginate({
        mapActionToKey: action => "merchants",
        types: [
            MerchantActions.MERCHANT_DELETE_REQUEST,
            MerchantActions.MERCHANT_DELETE_SUCCESS,
            MerchantActions.MERCHANT_DELETE_FAILURE
        ],
        cError: MerchantActions.MERCHANT_DELETE_CERROR
    }),
    merchantEdit: paginate({
        mapActionToKey: action => "merchant",
        types: [
            MerchantActions.MERCHANT_EDIT_REQUEST,
            MerchantActions.MERCHANT_EDIT_SUCCESS,
            MerchantActions.MERCHANT_EDIT_FAILURE
        ],
        cError: MerchantActions.MERCHANT_EDIT_CERROR
    }),
//Stores
    stores: paginate({
        mapActionToKey: action => "stores",
        entity: "stores",
        types: [
            StoresActions.STORES_LIST_REQUEST,
            StoresActions.STORES_LIST_SUCCESS,
            StoresActions.STORES_LIST_FAILURE
        ],
        cError: StoresActions.STORES_LIST_CERROR
    }),
    storeCreate: paginate({
        mapActionToKey: action => "store",
        types: [
            StoresActions.STORES_CREATE_REQUEST,
            StoresActions.STORES_CREATE_SUCCESS,
            StoresActions.STORES_CREATE_FAILURE
        ],
        cError: StoresActions.STORES_CREATE_CERROR
    }),
    storeEdit: paginate({
        mapActionToKey: action => "store",
        types: [
            StoresActions.STORE_EDIT_REQUEST,
            StoresActions.STORE_EDIT_SUCCESS,
            StoresActions.STORE_EDIT_FAILURE
        ],
        cError: StoresActions.STORE_EDIT_CERROR
    }),
    store: paginate({
        mapActionToKey: action => "store",
        types: [
            StoresActions.STORE_GET_REQUEST,
            StoresActions.STORE_GET_SUCCESS,
            StoresActions.STORE_GET_FAILURE
        ],
        cError: StoresActions.STORE_GET_CERROR
    }),
    //currencies
    currencyHistory: paginate({
        mapActionToKey: action => "history",
        types: [
            CurrenciesActions.CURRENCY_HISTORY_REQUEST,
            CurrenciesActions.CURRENCY_HISTORY_SUCCESS,
            CurrenciesActions.CURRENCY_HISTORY_FAILURE
        ],
        cError: CurrenciesActions.CURRENCY_HISTORY_CERROR
    })
});

const rootReducer = combineReducers({
    entities,
    pagination,
    user,
    sideBar,
    dictionary,
    routing: routeReducer
});


export default rootReducer

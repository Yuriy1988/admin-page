import {
    CurrenciesActions,
    MerchantActions,
    StoreActions,
    MerchantContractActions,
    PaySystemsContractsActions,
    PaySystemsActions,
    UserActions,

} from '../actions/index'
import merge from 'lodash/merge'
import paginate from './paginate'
import user from './user'
import system from './system'
import dictionary from './dictionary'
import sideBar from './sideBar'
import {routeReducer} from 'react-router-redux'
import {combineReducers} from 'redux'
import notifications from './notifications'
import notification from './notification'
import notification_to_add from './notification_to_add'
import managerList from './managers'
import manager_to_add from './manager_to_add'
import antiFraud from './antifraud'
import storeList from './storeList'
import chartStatistic from './chartStatistic'


// Updates an entity cache in response to any action with response.entities.
function entities (state = {
    merchants: {},
    stores: {},
    paySystems: {},
    merchantContracts: {},
    paysysContracts: {},
    currency: {},
    storePaySys: {}
}, action) {
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
//PaySystems
    paySystemsList: paginate({
        mapActionToKey: action => "paySystems",
        //entity: "paySystems",
        paginationId: "paySystemsList",
        types: [
            PaySystemsActions.PAYSYSTEMS_LIST_REQUEST,
            PaySystemsActions.PAYSYSTEMS_LIST_SUCCESS,
            PaySystemsActions.PAYSYSTEMS_LIST_FAILURE
        ],
        cError: PaySystemsActions.PAYSYSTEMS_LIST_CERROR
    }),
    paySystemEdit: paginate({
        mapActionToKey: action => "paySystems",
        //entity: "paySystems",
        paginationId: "paySystemEdit",
        types: [
            PaySystemsActions.PAYSYSTEM_EDIT_REQUEST,
            PaySystemsActions.PAYSYSTEM_EDIT_SUCCESS,
            PaySystemsActions.PAYSYSTEM_EDIT_FAILURE
        ],
        cError: PaySystemsActions.PAYSYSTEM_EDIT_CERROR
    }),
    paySystemGet: paginate({
        mapActionToKey: action => "paySystems",
        //entity: "paySystems",
        paginationId: "paySystemGet",
        types: [
            PaySystemsActions.PAYSYSTEM_GET_REQUEST,
            PaySystemsActions.PAYSYSTEM_GET_SUCCESS,
            PaySystemsActions.PAYSYSTEM_GET_FAILURE
        ],
        cError: PaySystemsActions.PAYSYSTEM_GET_CERROR
    }),
    //PaySystem contracts
    paysystemContractList: paginate({
        mapActionToKey: action => "contracts",
        paginationId: "paysystemContractList",
        entity: "paysystemContracts",
        types: [
            PaySystemsContractsActions.PAYSYSTEM_CONTRACT_LIST_REQUEST,
            PaySystemsContractsActions.PAYSYSTEM_CONTRACT_LIST_SUCCESS,
            PaySystemsContractsActions.PAYSYSTEM_CONTRACT_LIST_FAILURE
        ],
        cError: PaySystemsContractsActions.PAYSYSTEM_CONTRACT_LIST_CERROR
    }),
    paysystemContractEdit: paginate({
        mapActionToKey: action => "contracts",
        paginationId: "paysystemContractEdit",
        types: [
            PaySystemsContractsActions.PAYSYSTEM_CONTRACT_EDIT_REQUEST,
            PaySystemsContractsActions.PAYSYSTEM_CONTRACT_EDIT_SUCCESS,
            PaySystemsContractsActions.PAYSYSTEM_CONTRACT_EDIT_FAILURE
        ],
        cError: PaySystemsContractsActions.PAYSYSTEM_CONTRACT_EDIT_CERROR
    }),
    paysystemContractGet: paginate({
        mapActionToKey: action => "contracts",
        paginationId: "paysystemContractGet",
        types: [
            PaySystemsContractsActions.PAYSYSTEM_CONTRACT_GET_REQUEST,
            PaySystemsContractsActions.PAYSYSTEM_CONTRACT_GET_SUCCESS,
            PaySystemsContractsActions.PAYSYSTEM_CONTRACT_GET_FAILURE
        ],
        cError: PaySystemsContractsActions.PAYSYSTEM_CONTRACT_GET_CERROR
    }),
    paysystemContractCreate: paginate({
        mapActionToKey: action => "contracts",
        paginationId: "paysystemContractCreate",
        types: [
            PaySystemsContractsActions.PAYSYSTEM_CONTRACT_CREATE_REQUEST,
            PaySystemsContractsActions.PAYSYSTEM_CONTRACT_CREATE_SUCCESS,
            PaySystemsContractsActions.PAYSYSTEM_CONTRACT_CREATE_FAILURE
        ],
        cError: PaySystemsContractsActions.PAYSYSTEM_CONTRACT_CREATE_CERROR
    }),
//Merchants
    merchants: paginate({
        mapActionToKey: action => "merchants",
        entity: "merchants",
        paginationId: "merchantList",
        types: [
            MerchantActions.MERCHANTS_LIST_REQUEST,
            MerchantActions.MERCHANTS_LIST_SUCCESS,
            MerchantActions.MERCHANTS_LIST_FAILURE
        ],
        cError: MerchantActions.MERCHANTS_LIST_CERROR
    }),
    merchant: paginate({
        mapActionToKey: action => "merchant",
        paginationId: "merchantGet",
        types: [
            MerchantActions.MERCHANT_GET_REQUEST,
            MerchantActions.MERCHANT_GET_SUCCESS,
            MerchantActions.MERCHANT_GET_FAILURE
        ],
        cError: MerchantActions.MERCHANT_GET_CERROR
    }),
    merchantCreate: paginate({
        mapActionToKey: action => "merchant",
        paginationId: "merchantCreate",
        types: [
            MerchantActions.MERCHANT_CREATE_REQUEST,
            MerchantActions.MERCHANT_CREATE_SUCCESS,
            MerchantActions.MERCHANT_CREATE_FAILURE
        ],
        cError: MerchantActions.MERCHANT_CREATE_CERROR
    }),
    merchantDelete: paginate({
        mapActionToKey: action => "merchants",
        paginationId: "merchantDelete",
        types: [
            MerchantActions.MERCHANT_DELETE_REQUEST,
            MerchantActions.MERCHANT_DELETE_SUCCESS,
            MerchantActions.MERCHANT_DELETE_FAILURE
        ],
        cError: MerchantActions.MERCHANT_DELETE_CERROR
    }),
    merchantEdit: paginate({
        mapActionToKey: action => {return "merchant"},
        paginationId: "merchantEdit",
        types: [
            MerchantActions.MERCHANT_EDIT_REQUEST,
            MerchantActions.MERCHANT_EDIT_SUCCESS,
            MerchantActions.MERCHANT_EDIT_FAILURE
        ],
        cError: MerchantActions.MERCHANT_EDIT_CERROR
    }),
    //MerchatnContracts
    merchantContractList: paginate({
        mapActionToKey: action => "contracts",
        paginationId: "merchantContractList",
        entity: "merchantContracts",
        types: [
            MerchantContractActions.MERCHANT_CONTRACT_LIST_REQUEST,
            MerchantContractActions.MERCHANT_CONTRACT_LIST_SUCCESS,
            MerchantContractActions.MERCHANT_CONTRACT_LIST_FAILURE
        ],
        cError: MerchantContractActions.MERCHANT_CONTRACT_LIST_CERROR
    }),
    merchantContractEdit: paginate({
        mapActionToKey: action => "contracts",
        paginationId: "merchantContractEdit",
        types: [
            MerchantContractActions.MERCHANT_CONTRACT_EDIT_REQUEST,
            MerchantContractActions.MERCHANT_CONTRACT_EDIT_SUCCESS,
            MerchantContractActions.MERCHANT_CONTRACT_EDIT_FAILURE
        ],
        cError: MerchantContractActions.MERCHANT_CONTRACT_EDIT_CERROR
    }),
    merchantContractGet: paginate({
        mapActionToKey: action => "contracts",
        paginationId: "merchantContractGet",
        types: [
            MerchantContractActions.MERCHANT_CONTRACT_GET_REQUEST,
            MerchantContractActions.MERCHANT_CONTRACT_GET_SUCCESS,
            MerchantContractActions.MERCHANT_CONTRACT_GET_FAILURE
        ],
        cError: MerchantContractActions.MERCHANT_CONTRACT_GET_CERROR
    }),
    merchantContractCreate: paginate({
        mapActionToKey: action => "contracts",
        paginationId: "merchantContractCreate",
        types: [
            MerchantContractActions.MERCHANT_CONTRACT_CREATE_REQUEST,
            MerchantContractActions.MERCHANT_CONTRACT_CREATE_SUCCESS,
            MerchantContractActions.MERCHANT_CONTRACT_CREATE_FAILURE
        ],
        cError: MerchantContractActions.MERCHANT_CONTRACT_CREATE_CERROR
    }),
//Stores
    stores: paginate({
        mapActionToKey: action => "stores",
        paginationId: "storeList",
        entity: "stores",
        types: [
            StoreActions.STORES_LIST_REQUEST,
            StoreActions.STORES_LIST_SUCCESS,
            StoreActions.STORES_LIST_FAILURE
        ],
        cError: StoreActions.STORES_LIST_CERROR
    }),
    storeCreate: paginate({
        mapActionToKey: action => "store",
        paginationId: "storeCreate",
        types: [
            StoreActions.STORES_CREATE_REQUEST,
            StoreActions.STORES_CREATE_SUCCESS,
            StoreActions.STORES_CREATE_FAILURE
        ],
        cError: StoreActions.STORES_CREATE_CERROR
    }),
    storeEdit: paginate({
        mapActionToKey: action => "store",
        paginationId: "storeEdit",
        types: [
            StoreActions.STORE_EDIT_REQUEST,
            StoreActions.STORE_EDIT_SUCCESS,
            StoreActions.STORE_EDIT_FAILURE
        ],
        cError: StoreActions.STORE_EDIT_CERROR
    }),
    store: paginate({
        mapActionToKey: action => "store",
        paginationId: "storeGet",
        types: [
            StoreActions.STORE_GET_REQUEST,
            StoreActions.STORE_GET_SUCCESS,
            StoreActions.STORE_GET_FAILURE
        ],
        cError: StoreActions.STORE_GET_CERROR
    }),
    //StorePaysys
    storePaysysGet: paginate({

        mapActionToKey: action => "store",
        paginationId: "storePaysysGet",
        types: [
            StoreActions.STORE_PAYSYS_LIST_REQUEST,
            StoreActions.STORE_PAYSYS_LIST_SUCCESS,
            StoreActions.STORE_PAYSYS_LIST_FAILURE
        ],
        cError: StoreActions.STORE_PAYSYS_LIST_CERROR
    }),
    storePaysysUpdate: paginate({
        mapActionToKey: action => "store",
        paginationId: "storePaysysUpdate",
        types: [
            StoreActions.STORE_PAYSYS_UPDATE_REQUEST,
            StoreActions.STORE_PAYSYS_UPDATE_SUCCESS,
            StoreActions.STORE_PAYSYS_UPDATE_FAILURE
        ],
        cError: StoreActions.STORE_PAYSYS_UPDATE_CERROR
    }),
    //currencies
    currencyHistory: paginate({
        mapActionToKey: action => "history",
        paginationId: "currencyHistory",
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
    system,
    chartStatistic,
    user,
    antiFraud,
    sideBar,
    dictionary,
    notifications,
    notification_to_add,
    notification,
    managerList,
    manager_to_add,
    storeList,
    routing: routeReducer
});

export default rootReducer

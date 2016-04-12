import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import LoadingOverlay from '../../components/LoadingOverlay'
import Boolean from '../../components/Boolean'
import {StoreActions, PaySystemsActions} from '../../actions/index'

class StorePaySysComponent extends Component {
    constructor(props) {
        super(props);
        this.handleToggle = this.handleToggle.bind(this);
    }

    componentDidMount() {
        const {
            loadStorePaySys,
            loadPaySystems
        } = this.props;
        loadPaySystems();
        loadStorePaySys(this.props.storeId);
    }

    handleToggle(storePaySys) {
        const {enable, disable} = this.props;

        if (storePaySys.allowed) {
            disable(storePaySys.id);
        } else {
            enable(storePaySys.id);
        }
    }

    render() {
        const {
            getRequest,
            storePaySys,
            paySystems
        } = this.props;


        return (
            <div className="box">
                <div className="box-header with-border">
                    <h3 className="box-title">
                        Store Payment Systems
                    </h3>
                </div>
                <div className="box-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Playment system</th>
                                <th width="20px">Allowed</th>
                                <th width="100px">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            (getRequest.result) ?
                                getRequest.result.storePaysys.map((id, i) => {
                                    return StorePaySysItem.render(
                                        storePaySys[id],
                                        i,
                                        paySystems[storePaySys[id].paysysId],
                                        this.handleToggle.bind(this, storePaySys[id])
                                    )
                                }) : null
                        }
                        </tbody>
                    </table>
                </div>
                <LoadingOverlay loading={getRequest.isFetching}/>
            </div>
        )
    }
}

class StorePaySysItem {

    static render(storePaySys, i, paySystem, toggleCB) {
        return (
            <tr key={i}>
                <td >
                    {paySystem.paysysName}
                </td>
                <td>
                    <Boolean value={storePaySys.allowed}/>
                </td>
                <td>
                    <button className={"btn btn-sm btn-"+((storePaySys.allowed) ? "danger" : "success")}
                            onClick={toggleCB}>
                        <i className="fa fa-power-off"/>&nbsp;{(storePaySys.allowed) ? "Disable" : "Enable"}
                    </button>

                </td>
            </tr>
        )
    }
}


export default connect(
    (state)=>({
        storePaySys: state.entities.storePaySys,
        getRequest: state.pagination.storePaysysGet,
        paySystems: state.entities.paySystems
    }),
    {
        loadStorePaySys: StoreActions.getPaymentSystems,
        enable: StoreActions.activatePaySys,
        disable: StoreActions.deactivatePaySys,
        loadPaySystems: PaySystemsActions.getList
    }
)(StorePaySysComponent)

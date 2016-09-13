import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import Alert, {TYPE_ERROR, TYPE_INFO} from '../../components/Alert'
import * as ManagerAction from '../../actions/managers';
import LoadingOverlay from '../../components/LoadingOverlay';


class ManagerList extends Component {
    constructor (props) {
        super(props);
        this.message = (
            <div className="message">
                <Alert type={TYPE_INFO}>
                    {this.props.message}
                </Alert>
            </div>)
    }

    handleDeleteButton (manageId) {
        const {deleteManager} = this.props;
        deleteManager(manageId);
    }

    componentWillMount () {
        const merchantId  = this.props.params.merchantId;
        this.props.getManagerListById(merchantId);
    }

    componentWillUnmount () {
        this.props.clearManagerList();
    }


    render () {
        let {managerList, params:{merchantId}} = this.props;
        let {getManagerById} = this.props;
        const list = managerList.managerList;

        const content = list.map((manager, i) => {
            return (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                        <Link onClick={()=> {
                            getManagerById(list[i].id)
                        }}
                              to={`/admin/administrator/merchants/${merchantId}/managers/${list[i].id}`}>
                            {list[i].user.username}
                        </Link>
                    </td>
                    <td key={Math.random()}>
                        <div className="btn-toolbar pull-right">
                            <Link onClick={()=> {
                                getManagerById(list[i].id)
                            }}
                                  className="btn btn-sm btn-primary"
                                  to={`/admin/administrator/merchants/${merchantId}/managers/${list[i].id}/edit`}>
                                <i className="fa fa-edit"/> Edit
                            </Link>
                            <span className="btn btn-sm btn-danger"
                                  onClick={this.handleDeleteButton.bind(this, list[i].id)}>
                                <i className="fa fa-trash"/> Delete
                            </span>
                        </div>
                    </td>
                </tr>
            )
        });

        return <div>
            <div className="box">
                <div className="box-header with-border">
                    <h3 className="box-title"><i className="fa fa-users"/> Managers</h3>
                    <div className="box-tools pull-right">
                        <Link className="btn btn-sm btn-success"
                              to={`/admin/administrator/merchants/${merchantId}/managers/add`}><i
                            className="fa fa-plus"/> Add</Link>
                    </div>
                </div>
                {this.message}
                <div className="box-body no-padding">
                    <div className="table-responsive">
                        <table className="table table-hover table-striped">
                            <tbody>
                            <tr key="header">
                                <th width="5%">#</th>
                                <th>Name</th>
                                <th width="145px">Actions</th>
                            </tr>
                            {content}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-sm-3 small-margin">
                    <Alert type={TYPE_ERROR}>
                        {this.props.managerList.error}
                    </Alert>
                </div>
                <LoadingOverlay loading={managerList.isFetching }/>
            </div>

        </div>

    }
}

export default connect(
    (state)=>({
        managerList: state.managerList,
        message: state.notifications.message
    }),
    {
        getManagerById: ManagerAction.getManagerById,
        getManagerListById: ManagerAction.getManagerList,
        clearManagerList: ManagerAction.clearManagerList,
        deleteManager: ManagerAction.deleteManager
    }
)(ManagerList);


import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import * as AntiFraudActions from '../../actions/antifraud';
import AntiFraudTable from './AntiFraudTable'
import Alert, {TYPE_ERROR, TYPE_SUCCESS} from '../../components/Alert'

class AntiFraudPage extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.getAntiFraud();
    }
    render() {
        const {rules} = this.props.antiFraud;
        return  rules? (
            <div>
                <AntiFraudTable content={rules}/>
                <div className="message message-small">
                    <Alert type={TYPE_SUCCESS}>
                        {this.props.antiFraud.success}
                    </Alert>
                </div>
            </div>
        ) : (<div>wait</div>);
    }
}

export default connect(
    (state)=>({
        antiFraud: state.antiFraud
    }),
    {
        getAntiFraud: AntiFraudActions.getAntiFraud
    }
)(AntiFraudPage);
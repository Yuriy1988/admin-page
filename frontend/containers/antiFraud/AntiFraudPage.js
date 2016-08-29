import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import * as AntiFraudActions from '../../actions/antifraud';
import AntiFraudTable from './AntiFraudTable'

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
            <AntiFraudTable content={rules}/>
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
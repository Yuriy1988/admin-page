import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import * as AntiFraudActions from '../../actions/antifraud';


class AntiFraudPage extends Component {
    constructor(props) {
        super(props);

    }

    componentWillMount() {
        this.props.getAntiFraud()
    }

    componentWillUnmount() {

    }

    parseIncomingString (str) {
        const strBegining = str.indexOf('{');
        const strEnding = str.indexOf('}');
        return str.slice(strBegining, strEnding+1);
    }

    stringToTemplate(str) {
       // const replaced = this.parseIncomingString(str);
       // const  <input type="text" value={} data={replaced}/>
        str.replace(str, this.parseIncomingString(str))
    }

    render() {
        const rules = this.props.antiFraud.rules;

        const content = rules ? rules.map(function (result, i) {
            return (
                <tr key={i}>
                    <td key={Math.random()}>{result.formattedText}</td>
                    <td key={Math.random()}>{result.score}</td>
                </tr>)
        }) : (
            <tr key={1}>
                <td ></td>
                <td></td >
            </tr>);

        return (
            <div>
                <table className="statTable table table-bordered">
                    <thead>
                    <tr className="filter">
                        <th >Rule</th>
                        <th>Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {content}
                    </tbody>
                </table>
            </div>
        )

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


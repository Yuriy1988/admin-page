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


    getValueForInput(str) {
        const strBegining = str.indexOf('{');
        const strEnding = str.indexOf('}');
        const htmlInput = str.slice(strBegining, strEnding + 1);
        const htmlPart1 = str.slice(0, strBegining)
        const htmlPart2 = str.slice(strEnding + 1);
        return [htmlPart1, htmlInput, htmlPart2]
    }

    templateToHtml(str, threshold, id) {
        if (threshold) {
            const htmlParts = this.getValueForInput(str); //get python template, that will be replaced by input
            return (
                <div>
                    <span> {htmlParts[0]} </span>
                    <input type="text" value={`${threshold}`}/>
                    <span> {htmlParts[2]} </span>
                </div>);
        } else {
            return str;
        }
    }

    render() {
        const rules = this.props.antiFraud.rules;
        debugger;
        const self = this;
        const content = rules ? rules.map(function (result, i) {
            let str = result.formattedText;
            let id = result.id;
            let threshold = result.parameters && result.parameters.threshold ? result.parameters.threshold : null;
            var template = self.templateToHtml(str, threshold, id);

            return (
                <tr key={i}>
                    <td key={Math.random()}>{template}</td>
                    <td key={Math.random()}>{<input value={result.score}/>}</td>
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


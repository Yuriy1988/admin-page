import React, {Component, PropTypes} from 'react'
import AntiFraudInputThreshold from './AntifFaudInputThreshold'
import AntiFraudInputScore from './AntiFraudInputScore'

class AntiFraudTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rules: this.props.content,
            HTMLItems: []
        };
    }

    componentWillMount() {
        const self = this;

        const values = this.props.content.map(function (result, i) {
            return self.templateToHtml(result.formattedText, result.parameters.threshold, result.id, i);
        });
        this.setState({HTMLItems: values});
    }

    getValueForInput(str) {
        const strBegining = str.indexOf('{');
        const strEnding = str.indexOf('}');
        const htmlInput = str.slice(strBegining, strEnding + 1);
        const htmlPart1 = str.slice(0, strBegining);
        const htmlPart2 = str.slice(strEnding + 1);

        return [htmlPart1, htmlInput, htmlPart2]
    }

    templateToHtml(str, threshold, id, i) {
        const self = this;
        if (threshold) {
            const htmlParts = this.getValueForInput(str); //get python template, that will be replaced by input
            return (
                <div>
                    <span> {htmlParts[0]} </span>
                    <AntiFraudInputThreshold antiFraudId={id} threshold={self.state.rules[i].parameters.threshold}/>
                    <span> {htmlParts[2]} </span>
                </div>);
        } else {
            return str;
        }
    }

    handleSave() {
       console.log(this.state);
    }

    render() {
        const {rules, HTMLItems} = this.state;
        const self = this;
        return rules && rules.length > 0 ? (
            <div>
            <table className=" table table-striped table-bordered">
                <thead className="antifraud">
                <tr className="filter">
                    <th className="antifraud">Rule</th>
                    <th className="antifraud">Score</th>
                </tr>
                </thead>
                <tbody>
                {HTMLItems.map(function (HTML, i) {
                    return <tr key={i}>
                        <td key={Math.random()} className="antifraud"> {HTML}</td>
                        <td key={Math.random()} className="antifraud"> {< AntiFraudInputScore antiFraudId={self.state.rules[i].id}
                                                                                score={self.state.rules[i].score}/>}</td>
                    </tr>
                })}
                </tbody>
            </table>
                <button className="btn pull-left btn-success" onClick={this.handleSave.bind(this)}>
                    <i className="fa fa-save"/>&nbsp;Save
                </button>
                </div>
        ) : <div> wait </div>
    }
}

export default AntiFraudTable;
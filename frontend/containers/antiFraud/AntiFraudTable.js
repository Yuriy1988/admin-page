import React, {Component, PropTypes} from 'react'

class AntiFraudTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tests: this.props.content,
            rules: [],
            HTMLItems: []
        };
    }

    componentDidMount() {
        if (this.props.content && this.state.rules.length !== this.props.content.length && this.props.content) {
            const self = this;
            self.setState({rules: self.props.content});

            const values = this.props.content.map(function (result, i) {
                return self.templateToHtml(result.formattedText, result.parameters.threshold, result.id, i);
            });
            this.setState({HTMLItems: values});
        }
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
                    <input onChange={self.handleChange.bind(self)} className={id} type="text" value={self.state.tests[i].parameters.threshold}/>
                    <span> {htmlParts[2]} </span>
                </div>);
        } else {
            return str;
        }
    }

    render() {
        console.log(this.state.tests);
        const {rules, HTMLItems} = this.state;
        const self = this;
        return rules && rules.length > 0 ? (
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
                        <td key={Math.random()} className="antifraud" > {HTML}</td>
                        <td key={Math.random()} className="antifraud"> {< input onChange={self.handleChange.bind(self)} id={i}
                                                                                value={self.state.tests[i].score}/>}</td>
                    </tr>
                })}
                </tbody>
            </table>
        ) : <div> wait </div>
    }
}

export default AntiFraudTable;
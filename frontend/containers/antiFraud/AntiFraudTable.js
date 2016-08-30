import React, {Component, PropTypes} from 'react'
import * as AntiFraudActions from '../../actions/antifraud';
import {connect} from 'react-redux'

class AntiFraudTable extends Component {
    constructor(props) {
        super(props);

    }

    JsonToHTML(JSON) {
        const strings = JSON.formattedText.split(' ');
        let result = strings.map(function (item) {

            if (item.indexOf('{') >= 0) {

                const begining = item.indexOf('{');
                const ending = item.indexOf('}');
                let itemVal = item.slice(begining + 1, ending);
                return item.slice(0, begining) + `<input type="text" name="${JSON.id}" data-name="${itemVal}" value="${JSON.parameters[itemVal]}">` + item.slice(ending + 1, item.length);
            }
            return item;
        });
        return result.join(' ');
    }

    handleSave() {
        let result = {
            rules: []
        };

        const inputs = $('.antifraud-table').find('input');
        let ids = [];
        Array.prototype.forEach.call(inputs, function (item, i) {
            let obj = {};

            if (ids.indexOf(item.name) === -1) {

                ids.push(item.name);
                obj.id = item.name;

                if (item.dataset.score) {
                    obj.score = item.value;
                } else {
                    obj.parameters = {};
                    obj.parameters[item.dataset.name] = item.value
                }
                result.rules.push(Object.assign({}, obj));
            } else {
                result.rules.forEach(function (j, k) {
                    if (j.id === item.name) {
                        console.log(true);
                        result.rules[k][item.dataset.score] = item.value;
                    }
                });

            }
        });
        this.props.setAntiFraud(result);
    }

    render() {
        const {content} = this.props;
        const self = this;

        return (<div>
            <table className=" table table-striped table-bordered">
                <thead className="antifraud">
                <tr className="filter">
                    <th className="antifraud">Rule</th>
                    <th className="antifraud">Score</th>
                </tr>
                </thead>
                <tbody className="antifraud-table">
                {content.map(function (HTML, i) {
                    return <tr key={i}>
                        <td key={Math.random()} className="antifraud">
                            <div dangerouslySetInnerHTML={{__html: self.JsonToHTML(content[i])}}></div>
                        </td>
                        <td key={Math.random()} className="antifraud">
                            <div
                                dangerouslySetInnerHTML={{__html: `<input type="text" data-score="score" name=${content[i].id} value=${content[i].score}>`}}></div>
                        </td>
                    </tr>
                })}
                </tbody>
            </table>
            <button className="btn pull-left btn-success" onClick={this.handleSave.bind(this)}>
                <i className="fa fa-save"/>&nbsp;Save
            </button>
        </div>)
    }
}

export default connect(
    (state)=>({

    }),
    {
        setAntiFraud: AntiFraudActions.setAntiFraud
    }
)(AntiFraudTable);
import React, {Component, PropTypes} from 'react'
import * as AntiFraudActions from '../../actions/antifraud';
import {connect} from 'react-redux';
import Alert, {TYPE_ERROR} from '../../components/Alert'


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
                return item.slice(0, begining) + `<input data-text="${JSON.formattedText}" type="text" name="${JSON.id}" data-name="${itemVal}" value="${JSON.parameters[itemVal]}">` + item.slice(ending + 1, item.length);
            }
            return item;
        });
        return result.join(' ');
    }

    shouldComponentUpdate() {
        return false
    }

    handleSave() {
        let result = {
            rules: []
        };
        const $settingsInput = $('.secureVal');
        const settingsVal = $settingsInput.val();


        const inputs = $('.antifraud-table').find('input');
        let ids = [];
        Array.prototype.forEach.call(inputs, function (item, i) {
            let obj = {};

            if (ids.indexOf(item.name) === -1) {

                ids.push(item.name);
                obj.id = item.name;
                obj['formatted_text'] = item.dataset.text;
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

        if (isNaN(settingsVal) ||  settingsVal<=0 || settingsVal>100) {
            $settingsInput.css({"border-color": "red",
                "border-width":"2px",
                "border-style":"solid"});
        } else {
            $settingsInput.css({"border-color": "green",
                "border-width":"1px",
                "border-style":"solid"});

            this.props.setAntiFraudSettings({
                three_d_secure_threshold: settingsVal,
                decline_threshold: 100
            });
            result.rules.forEach(function (item) {
                this.props.setAntiFraud(item, item.id);
            }, this);
        }
    }

    render() {
        const {content, declineThreshold, threeDSecureThreshold} = this.props;


        const self = this;

        return (
            <div>
                <table className="header-antifraud">
                    <tbody>
                        <tr>
                            <td  dangerouslySetInnerHTML={{__html: `<b>Score threshold (${declineThreshold} max) &nbsp&nbsp&nbsp</b>`}}></td>
                            <td  dangerouslySetInnerHTML={{__html: `<b>3d secure < </b> <input class="secureVal" type="text" value="${threeDSecureThreshold}"> <b> > process</b>`}}></td>
                        </tr>
                    </tbody>
                </table>

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
                                    dangerouslySetInnerHTML={{__html: `<input type="text" data-score="score"  data-text="${content[i].formattedText}" name="${content[i].id}" value="${content[i].score}">`}}></div>
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
        success: state.antiFraud.success
    }),
    {
        setAntiFraud: AntiFraudActions.setAntiFraud,
        setAntiFraudSettings: AntiFraudActions.setAntiFraudSettings
    }
)(AntiFraudTable);
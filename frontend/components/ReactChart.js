import React, {Component} from 'react'
import {Pie} from 'react-chartjs-2';

class ReactChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
         return this.props.chartStatistic &&
             this.props.chartOptions &&
             this.props.chartStatistic.data &&
             this.props.chartStatistic.data.labels.length ? (
                 <div>
                    <Pie data={this.props.chartStatistic.data}/>
                     <select
                         className="form-control"
                         onChange={this.props.onChangeStatHandler}>
                         {this.props.chartOptions.map(function (item, i) {
                             return  <option key = {i}>{item}</option>
                         })}
                     </select>
                 </div>): <div></div>
    }
}

export default ReactChart;
import PieChart from 'react-svg-piechart'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'



class ReactChart extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            expandedSector: null,
        }
    }

    handleMouseEnterOnSector(sector) {
        this.setState({expandedSector: sector})
    }

    handleMouseLeaveFromSector() {
        this.setState({expandedSector: null})
    }

    render() {
        const data = [
            {label: 'Facebook', value: 100, color: '#3b5998'},
            {label: 'Twitter', value: 60, color: '#00aced'},
            {label: 'Google Plus', value: 30, color: '#dd4b39'},
            {label: 'Pinterest', value: 20, color: '#cb2027'},
            {label: 'Linked In', value: 10, color: '#007bb6'},
        ];

        return (
            <div className="chartStatistic">
                <PieChart
                    data={ data }
                    expandedSector={ this.state.expandedSector }
                    onMouseEnterOnSector={this.handleMouseEnterOnSector.bind(this) }
                    onMouseLeaveFromSector={this.handleMouseLeaveFromSector.bind(this) }
                />

                <div>
                    {data.map((d, i) => (<div key={ i }><span style={{background: d.color}}></span> <span
                            style={{fontWeight: this.state.expandedSector == i ? 'bold' : null}}>
                { d.label } : { d.value }
              </span>
                        </div>
                    ))
                    }
                </div>
            </div>
        )
    }
}


export default connect((state)=> {
    return {user: state.user}
})(ReactChart)

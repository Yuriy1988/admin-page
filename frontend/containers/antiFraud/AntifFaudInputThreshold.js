import React, {Component, PropTypes} from 'react'


class AntiFraudInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.antiFraudId,
            parameters: {threshold: this.props.threshold},
        }
    }

    handleChange(e) {
        this.setState({parameters: {threshold: e.target.value}})
    }

    render() {
        return(
         <input type="text" value={this.state.parameters.threshold}
                   onChange={this.handleChange.bind(this)}/>)
    }
}

export default AntiFraudInput;
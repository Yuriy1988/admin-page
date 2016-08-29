import React, {Component, PropTypes} from 'react'


class AntiFraudInputScore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            score: this.props.score,
            id: this.props.antiFraudId,
        }
    }

    handleChange(e) {
        this.setState({score: e.target.value});
    }

    render() {
        return (
            <input type="text" value={this.state.score }
                   onChange={this.handleChange.bind(this)}/>
        )
    }
}

export default AntiFraudInputScore;
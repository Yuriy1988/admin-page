import React, { Component, PropTypes } from 'react'

const GITHUB_REPO = 'https://github.com/rackt/redux'

class Explore extends Component {

    render() {
        console.log(this.props);
        window.TEST = this.props;
        const {login,name} = this.props.user;
        return (
            <div>
                <p>{login}</p>
                <p>{name}</p>
                <button>Get</button>
            </div>
        )
    }
}


import * as actionCreators from '../actions/user'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

function mapStateToProps(state) {
    return { user: state.user }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(actionCreators, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Explore)
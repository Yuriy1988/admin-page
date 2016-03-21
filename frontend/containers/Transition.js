import React, { Component } from 'react'

import EasyTransition from 'react-easy-transition'

export default class Transition extends Component {
    render() {
        const {children, path} = this.props;
        return (
            <EasyTransition
                path={ path || location.pathname }
                initialStyle={{transform: "perspective(500px) translateY(-25px) ", opacity: 0}}
                transition="transform 0.4s ease-in-out,opacity 0.4s ease-in-out "
                finalStyle={{transform: "perspective(500px) translateY(0)", opacity: 1}}>
                {children}
            </EasyTransition>
        );
    }
}

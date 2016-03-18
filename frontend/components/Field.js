import React, { Component } from 'react'


export default class Field extends Component {

    render() {
        const {children, error} = this.props;
        return (
            <div className={`form-group ${(!!error) ? "has-error" : ""} `}>
                {children}
                {(!!error) ? (error.map((e, i) => <p className="help-block" key={i}>{e}</p>)) : null}
            </div>
        );
    }
}

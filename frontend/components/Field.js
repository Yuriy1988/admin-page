import React, { Component } from 'react'


export default class Field extends Component {

    render() {
        const {children, error} = this.props;
        return (
            <div className={`field form-group ${(!!error) ? "has-error" : ""} `}>
                {children}
                <span className="absolute">{(!!error) ? <span className="help-block" > {(error.map((e, i) =>  e))}</span> : null}</span>
            </div>
        );
    }
}

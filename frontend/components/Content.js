import React, { Component } from 'react'

export default class Content extends Component {
    render() {
        const {children} = this.props;
        return (
            <div className="content-wrapper">
                <section className="content">
                    {children}
                </section>
            </div>
        );
    }
}

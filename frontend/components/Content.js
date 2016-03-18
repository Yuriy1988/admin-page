import React, { Component } from 'react'

import EasyTransition from 'react-easy-transition'

export default class Content extends Component {
    render() {
        const {children} = this.props;
        return (
            <div className="content-wrapper">
                <section className="content">
                    <EasyTransition
                        path={location.pathname}
                        initialStyle={{transform: "perspective(500px) translateY(-25px) ", opacity: 0}}
                        transition="transform 0.4s ease-in-out,opacity 0.4s ease-in-out "
                        finalStyle={{transform: "perspective(500px) translateY(0)", opacity: 1}} >
                        {children}
                    </EasyTransition>

                    {/*<EasyTransition
                        path={location.pathname}
                        initialStyle={{webkitFilter: "blur(20px)", opacity: 0}}
                        transition="-webkit-filter 0.4s ease-in-out, opacity 0.4s ease-in-out "
                        finalStyle={{webkitFilter: "blur(0px)", opacity: 1}} >
                        {children}
                    </EasyTransition>*/}

                </section>
            </div>
        );
    }
}

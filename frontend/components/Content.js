import React, { Component } from 'react'


export default class Content extends Component {
    render() {
        const {children} = this.props;
        return (
            <div className="content-wrapper">
                <section className="content">
                    {children}


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

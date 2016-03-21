import React, { Component } from 'react'


class MerchantContractsPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { children } = this.props;

        return (
            <div>
                {/*<i className="fa fa-shopping-cart"/>*/}
                {children}
            </div>
        )
    }
}


export default MerchantContractsPage

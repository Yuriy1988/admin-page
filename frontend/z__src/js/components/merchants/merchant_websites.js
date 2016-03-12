import React from 'react'

const MerchantWebsites = React.createClass({
  render() {
    return (
      <table className="table table-condensed">
        <tbody>
          <tr>
            <th className="text-center" style={{width:'15px'}}>#</th>
            <th>Name</th>
            <th>Url</th>
            <th>Logo</th>
            <th className="text-center" style={{width:'300px'}}>Operations</th>
          </tr>
            <tr>
              <td className="text-center">1.</td>
              <td>sasas</td>
              <td>
                <i className="glyphicon glyphicon-globe"></i>&nbsp;
                  http://asas.com
              </td>
              <td>
                ?{/*Logo here*/}
              </td>
              <td className="text-center">
                <a className="btn btn-primary btn-xs" href="#/merchant/1/sites/5/edit">Modify</a>
                <a className="btn btn-success btn-xs" href="#/merchant/1/sites/5/pays">Payment Systems</a>
                <a className="btn btn-danger btn-xs">Delete</a>
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
})

export default MerchantWebsites
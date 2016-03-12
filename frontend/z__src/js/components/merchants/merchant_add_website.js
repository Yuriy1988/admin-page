import React from 'react'
/*make header!*/
const MerchantAddWebsite = React.createClass({
  render() {
    return (
      <div className="tab-content no-padding">
        <div className="row">
          <div className="col-xs-12">
              <div className="box">
                  <div className="box-header">
                      <h3 className="box-title">
                          <span>
                            <span>Add New Website</span>
                          </span>
                      </h3>
                  </div>
                  <div className="box-body">
                      <div className="row">
                          <div className="col-xs-4">
                              <label forName="name">Website name</label>
                              <div className="form-group">
                                  <input type="text" className="form-control" id="name" placeholder="Please, enter website name"/>
                              </div>
                          </div>
                          <div className="col-xs-4">
                              <div className="form-group">
                                  <label forName="code">Code</label>
                                  <input type="text" className="form-control" id="code" disabled="disabled" value="blabla"/>
                              </div>
                          </div>
                          <div className="col-xs-4">
                              <div className="form-group">
                                  <label forName="commission"><span>Comission</span> %</label>
                                  <input type="text" className="form-control" id="commission" placeholder="Введите комиссию" />
                              </div>
                          </div>
                          <div className="col-xs-4">
                              <label forName="url">URL</label>
                              <div className="form-group">
                                  <input type="text" className="form-control" id="url" placeholder="Please, enter website URL" />
                              </div>
                          </div>
                          <div className="col-xs-4">
                              <div className="form-group">
                                  <label forName="key">Key</label>
                                  <input type="text" className="form-control" id="key" value="blablabla" disabled="disabled" />
                              </div>
                          </div>
                          <div className="col-xs-4">
                              <label forName="urlSuccess">URL for success operation</label>
                              <div className="form-group">
                                  <input type="text" className="form-control" id="urlSuccess" placeholder="URL for success payment" />
                              </div>
                          </div>
                          <div className="col-xs-4">
                              <div className="form-group">
                                  <label forName="category">Category</label>
                                  <input type="text" className="form-control" id="category" placeholder="Please, insert categories" />
                              </div>
                          </div>
                          <div className="col-xs-4">
                              <div className="form-group">
                                  <label forName="about">Description</label>
                                  <input type="text" className="form-control" id="about" placeholder="Website description" />
                              </div>
                          </div>
                          <div className="col-xs-4">
                              <label forName="urlFail">URL for reject operation</label>
                              <div className="form-group">
                                  <input type="text" className="form-control" id="urlFail" placeholder="URL for refused payment"/>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="box-body">
                     <div className="row">
                        <div className="col-xs-4">
                           <div className="btn-group">
                              <label>Show Logo </label>
                              <input type="checkbox"/>
                           </div>
                           <div className="form-group">
                              <input type="file" fileread="site.setting.logo"/>
                              <br/>
                           </div>
                        </div>
                        <div className="col-xs-4">
                           <label className="ng-scope">Algorithm </label>
                           <div className="btn-group">
                              <label className="btn btn-default">
                                 <input type="radio" name="algorithm" value="MD5"/> MD5
                              </label>
                              <label className="btn btn-default">
                                 <input type="radio" name="algorithm" value="SHA1"/> SHA1
                              </label>
                           </div>
                        </div>
                        <div className="col-xs-4">
                           <label>Notification type</label>
                           <div className="btn-group">
                              <label className="btn btn-default">
                                 <input type="radio" name="notifyType" value="EMAIL"/> EMAIL
                              </label>
                              <label className="btn btn-default">
                                 <input type="radio" name="notifyType" value="SMS"/> SMS
                              </label>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="box-footer clearfix">
                    <div className="pull-right">
                      <button className="btn btn-success">Save</button>
                        <a className="btn btn-default" href="#/">Cancel</a>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    )
  }
})

export default MerchantAddWebsite
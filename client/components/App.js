import React, { Component } from 'react';
import axios from 'axios';
var querystring = require('querystring');
import { Button , Modal, ButtonGroup, Label} from 'react-bootstrap';
import '../css/App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      mongodb: {
        user : "sachin",
        password : "lamba",
        url : "ds253587.mlab.com",
        port : 53587,
        collection : "ppsample"
      },
      mysqldb: {
        user : "root",
        password : "lamba@",
        host : "localhost",
        port : 3306,
        database : "sakila"
      },
      messageFromMongoServer : "",
      messageFromMySQLServer : "",
      connect: false,
      mongoConnectTry: false,
      mysqlConnectTry: false,
      show: false,
      sqlTables: [],
      forignKeys: [],
      tableSelected: "",
      singleTableColumns: []
    }
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

  }
  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }
  connectMongo() {
    let _this = this;
    _this.setState({
      mongoConnectTry: true
    });
      axios.post('/connect2MongoDB',{
          user: this.state.mongodb.user,
          password: this.state.mongodb.password,
          url: this.state.mongodb.url,
          port: this.state.mongodb.port,
          collection: this.state.mongodb.collection
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      ).then(function(response) {
        console.log("return", response);
        _this.setState({
          messageFromMongoServer: response.data.message ? response.data.message : "Error while connection with MongoDB.",
          connect: response.data.result,
          mongoConnectTry: false
        });
      });
  }
  fetchMySQLMetadata() {
    let _this = this;
    _this.setState({
      mysqlConnectTry: true
    });
      axios.post('/fetchMySQLMetadata',{
          user: this.state.mysqldb.user,
          password: this.state.mysqldb.password,
          host: this.state.mysqldb.host,
          port: this.state.mysqldb.port,
          database: this.state.mysqldb.database
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      ).then(function(response) {
        console.log("metadata return value ", response);
        _this.setState({
          messageFromMySQLServer: (response.data.message || response.data.code) ? (response.data.message || response.data.code) : "Error while connection with MySQL metadata.",
          sqlTables: response.data.tables,
          show: response.data.result,
          mysqlConnectTry: false,
          forignKeys: [],
          singleTableColumns: [],
          tableSelected: ""
        });
      });
  }
  fetchTableKeys(t, tableName) {
    debugger;
    let _this = this;
    _this.setState({
      mysqlConnectTry: true,
      tableSelected: tableName
    });
      axios.post('/fetchTableKeys',{
          user: this.state.mysqldb.user,
          password: this.state.mysqldb.password,
          host: this.state.mysqldb.host,
          port: this.state.mysqldb.port,
          database: this.state.mysqldb.database,
          tableName: tableName
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      ).then(function(response) {
        console.log("forign keys return value ", response);
        _this.setState({
          // messageFromMySQLServer: (response.data.message || response.data.code) ? (response.data.message || response.data.code) : "Error while connection with MySQL metadata.",
          forignKeys: response.data.forignKeys,
          singleTableColumns: response.data.singleTableColumns,
          mysqlConnectTry: false
        });
      });
  }
  connectMySQL() {
    let _this = this;
    _this.setState({
      mysqlConnectTry: true
    });
      axios.post('/connect2MySQL',{
          user: this.state.mysqldb.user,
          password: this.state.mysqldb.password,
          host: this.state.mysqldb.host,
          port: this.state.mysqldb.port,
          database: this.state.mysqldb.database
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      ).then(function(response) {
        console.log("return", response);
        _this.setState({
          messageFromMySQLServer: (response.data.message || response.data.code) ? (response.data.message || response.data.code) : "Error while connection with MySQL.",
          connect: response.data.result,
          mysqlConnectTry: false
        });
      });
  }
  updateMongoConnection(evt, field) {
    let mongoConnect = this.state.mongodb;
    mongoConnect[field] = evt.target.value;
    this.setState({
      mongodb: mongoConnect
    });
  }
  updateMySQLConnection(evt, field) {
    let mysqlConnect = this.state.mysqldb;
    mysqlConnect[field] = evt.target.value;
    this.setState({
      mysqldb: mysqlConnect
    });
  }

  render() {

    return (
      <div className="App">
        <div>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>MySQL Metadata</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-sm-3">
                <h3>Tables in <p style={{display: "inline-block"}} className="font-weight-light">{this.state.mysqldb.database}</p> schema.</h3>
                { this.state.sqlTables.length ?
                  <ButtonGroup vertical block>
                  {
                    this.state.sqlTables.map(table => {
                      return <Button onClick={(e) => this.fetchTableKeys(e, table["tableName"])}>{table["tableName"]}</Button>
                    })
                  }
                  </ButtonGroup>
                  :
                    <div>No Tables found for this schema</div>
                }
              </div>
              <div className="col-sm-3">
                <div style={{display: 'flex', flexDirection: 'column'}}>
                      <div style={{flex: '1'}}>
                        <h3>Forign Keys</h3>
                        { this.state.forignKeys.length ?
                          this.state.forignKeys.map(fk => {
                            return <div style={{margin: "30px"}}>
                                      <Label bsStyle="default">{fk['fkName']}</Label>{' '} of Table {' '}<Label bsStyle="primary">{fk['fktableName']}</Label>{' '}
                                      connected to{' '}
                                      <Label bsStyle="default">{fk['pkcolumnName']}</Label>{' '} of Table {' '}<Label bsStyle="primary">{fk['pktableName']}</Label>{' '}
                                    </div>
                          })
                          :
                          <div>
                            {
                              this.state.tableSelected != "" ?
                                <div>No FK found on {this.state.tableSelected}.</div>
                              :
                                <div>Select a table to get FK details</div>
                            }
                          </div>
                        }
                      </div>
                      <div style={{flex: '1'}}>
                        <h3>Columns in Table : {this.state.tableSelected}</h3>
                        {
                          (this.state.singleTableColumns && this.state.singleTableColumns.length) ?
                            this.state.singleTableColumns.map(col => {
                              return <div>{col['columnName']} {' <-> '} {col['typeName']}</div>
                            })
                            :
                            <div>No Columns found...</div>
                        }
                      </div>
                </div>
              </div>
            </div>
          </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
        <div className="container">
          <div className="row">
          <div className="col-md-6">
            <h2>MySQL</h2>
            <h6>test : root | lamba@ | localhost | 3306 | sakila</h6>
            <form>
              <div className="form-group">
                <label for="UserName">DB UserName</label>
                <input type="text" className="form-control" id="mysql_user" placeholder="Enter UserName"
                    value={this.state.mysqldb.user} onChange={evt => this.updateMySQLConnection(evt, "user")}/>
              </div>
              <div className="form-group">
                <label for="Password">DB Password</label>
                <input type="password" className="form-control" id="mysql_password" placeholder="Password"
                    value={this.state.mysqldb.password} onChange={evt => this.updateMySQLConnection(evt, "password")}/>
              </div>
              <div className="form-group">
                <label for="URL">Host</label>
                <input type="text" className="form-control" id="mysql_url" placeholder="Enter Host"
                    value={this.state.mysqldb.host} onChange={evt => this.updateMySQLConnection(evt, "host")}/>
                <small id="emailHelp" className="form-text text-muted">Provide MongoDB connection Host</small>
              </div>
              <div className="form-group">
                <label for="PORT">PORT</label>
                <input type="number" className="form-control" id="mysql_port" placeholder="Enter Port Number"
                    value={this.state.mysqldb.port} onChange={evt => this.updateMySQLConnection(evt, "port")}/>
              </div>
              <div className="form-group">
                <label for="Collection">Database</label>
                <input type="text" className="form-control" id="mysql_collection"  placeholder="Enter Database Name"
                    value={this.state.mysqldb.database} onChange={evt => this.updateMySQLConnection(evt, "database")}/>
              </div>
              <div type="button" className="btn btn-primary" onClick={this.connectMySQL.bind(this)}>Connect</div>
              <div type="button" className="btn btn-secondary" onClick={this.fetchMySQLMetadata.bind(this)}>Metadata</div>
              {
                this.state.mysqlConnectTry ?
                <div className="loadersmall"></div>
                :
                <div>{
                  this.state.messageFromMySQLServer && this.state.result ?
                   <h4 className="bg-success">{this.state.messageFromMySQLServer}</h4>
                   :
                   <h4 className="bg-danger">{this.state.messageFromMySQLServer}</h4>
                }</div>
              }
            </form>
          </div>
            <div className="col-md-6">
              <h2>MongoDB</h2>
              <h6>test : sachin | lamba | ds253587.mlab.com | 53587 | ppsample</h6>
              <form>
                {/* mongodb://<dbuser>:<dbpassword>@ds253587.mlab.com:53587/ppsample */}
                <div className="form-group">
                  <label for="UserName">DB UserName</label>
                  <input type="text" className="form-control" id="mdb_user" placeholder="Enter UserName"
                      value={this.state.mongodb.user} onChange={evt => this.updateMongoConnection(evt, "user")}/>
                </div>
                <div className="form-group">
                  <label for="Password">DB Password</label>
                  <input type="password" className="form-control" id="mdb_password" placeholder="Password"
                      value={this.state.mongodb.password} onChange={evt => this.updateMongoConnection(evt, "password")}/>
                </div>
                <div className="form-group">
                  <label for="URL">URL</label>
                  <input type="text" className="form-control" id="mdb_url" placeholder="Enter URL"
                      value={this.state.mongodb.url} onChange={evt => this.updateMongoConnection(evt, "url")}/>
                  <small id="emailHelp" className="form-text text-muted">Provide MySQL connection URL</small>
                </div>
                <div className="form-group">
                  <label for="PORT">PORT</label>
                  <input type="number" className="form-control" id="mdb_port" placeholder="Enter Port Number"
                      value={this.state.mongodb.port} onChange={evt => this.updateMongoConnection(evt, "port")}/>
                </div>
                <div className="form-group">
                  <label for="Collection">Collection</label>
                  <input type="text" className="form-control" id="mdb_collection"  placeholder="Enter Collection Name"
                      value={this.state.mongodb.collection} onChange={evt => this.updateMongoConnection(evt, "collection")}/>
                </div>
                <div type="button" className="btn btn-primary" onClick={this.connectMongo.bind(this)}>Connect</div>
                {
                  this.state.mongoConnectTry ?
                  <div className="loadersmall"></div>
                  :
                  <div>{
                    this.state.messageFromMongoServer && this.state.result ?
                     <h4 className="bg-success">{this.state.messageFromMongoServer}</h4>
                     :
                     <h4 className="bg-danger">{this.state.messageFromMongoServer}</h4>
                  }</div>
                }
              </form>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
export default App;

import React, { Component } from 'react';
import axios from 'axios';
var querystring = require('querystring');
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
        database : "products"
      },
      messageFromMongoServer : "",
      messageFromMySQLServer : "",
      connect: false,
      mongoConnectTry: false,
      mysqlConnectTry: false
    }
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
          // connect: response.data.result,
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
        {/* <header className="App-header">
          <h1 className="App-title">Connect</h1>
        </header> */}
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h2>MongoDB</h2>
              <h6>test : sachin | lamba | ds253587.mlab.com | 53587 | ppsample</h6>
              <form>
                {/* mongodb://<dbuser>:<dbpassword>@ds253587.mlab.com:53587/ppsample */}
                <div class="form-group">
                  <label for="UserName">DB UserName</label>
                  <input type="text" class="form-control" id="mdb_user" placeholder="Enter UserName"
                      value={this.state.mongodb.user} onChange={evt => this.updateMongoConnection(evt, "user")}/>
                </div>
                <div class="form-group">
                  <label for="Password">DB Password</label>
                  <input type="password" class="form-control" id="mdb_password" placeholder="Password"
                      value={this.state.mongodb.password} onChange={evt => this.updateMongoConnection(evt, "password")}/>
                </div>
                <div class="form-group">
                  <label for="URL">URL</label>
                  <input type="text" class="form-control" id="mdb_url" placeholder="Enter URL"
                      value={this.state.mongodb.url} onChange={evt => this.updateMongoConnection(evt, "url")}/>
                  <small id="emailHelp" class="form-text text-muted">Provide MySQL connection URL</small>
                </div>
                <div class="form-group">
                  <label for="PORT">PORT</label>
                  <input type="number" class="form-control" id="mdb_port" placeholder="Enter Port Number"
                      value={this.state.mongodb.port} onChange={evt => this.updateMongoConnection(evt, "port")}/>
                </div>
                <div class="form-group">
                  <label for="Collection">Collection</label>
                  <input type="text" class="form-control" id="mdb_collection"  placeholder="Enter Collection Name"
                      value={this.state.mongodb.collection} onChange={evt => this.updateMongoConnection(evt, "collection")}/>
                </div>
                <div type="button" class="btn btn-primary" onClick={this.connectMongo.bind(this)}>Connect</div>
                {
                  this.state.mongoConnectTry ?
                  <div className="loadersmall"></div>
                  :
                  <div>{
                    this.state.messageFromMongoServer && this.state.result ?
                     <h4 class="bg-success">{this.state.messageFromMongoServer}</h4>
                     :
                     <h4 class="bg-danger">{this.state.messageFromMongoServer}</h4>
                  }</div>
                }
              </form>
            </div>
            <div className="col-md-6">
              <h2>MySQL</h2>
              <h6>test : productssql | lamba@ | den1.mssql6.gear.host | 3306 | productssql</h6>
              <form>
                <div class="form-group">
                  <label for="UserName">DB UserName</label>
                  <input type="text" class="form-control" id="mysql_user" placeholder="Enter UserName"
                      value={this.state.mysqldb.user} onChange={evt => this.updateMySQLConnection(evt, "user")}/>
                </div>
                <div class="form-group">
                  <label for="Password">DB Password</label>
                  <input type="password" class="form-control" id="mysql_password" placeholder="Password"
                      value={this.state.mysqldb.password} onChange={evt => this.updateMySQLConnection(evt, "password")}/>
                </div>
                <div class="form-group">
                  <label for="URL">Host</label>
                  <input type="text" class="form-control" id="mysql_url" placeholder="Enter Host"
                      value={this.state.mysqldb.host} onChange={evt => this.updateMySQLConnection(evt, "host")}/>
                  <small id="emailHelp" class="form-text text-muted">Provide MongoDB connection Host</small>
                </div>
                <div class="form-group">
                  <label for="PORT">PORT</label>
                  <input type="number" class="form-control" id="mysql_port" placeholder="Enter Port Number"
                      value={this.state.mysqldb.port} onChange={evt => this.updateMySQLConnection(evt, "port")}/>
                </div>
                <div class="form-group">
                  <label for="Collection">Database</label>
                  <input type="text" class="form-control" id="mysql_collection"  placeholder="Enter Database Name"
                      value={this.state.mysqldb.database} onChange={evt => this.updateMySQLConnection(evt, "database")}/>
                </div>
                <div type="button" class="btn btn-primary" onClick={this.connectMySQL.bind(this)}>Connect</div>
                <div type="button" class="btn btn-secondary" onClick={this.fetchMySQLMetadata.bind(this)}>Metadata</div>
                {
                  this.state.mysqlConnectTry ?
                  <div className="loadersmall"></div>
                  :
                  <div>{
                    this.state.messageFromMySQLServer && this.state.result ?
                     <h4 class="bg-success">{this.state.messageFromMySQLServer}</h4>
                     :
                     <h4 class="bg-danger">{this.state.messageFromMySQLServer}</h4>
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

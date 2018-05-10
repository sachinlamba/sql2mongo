import React, { Component } from 'react';
import axios from 'axios';
var querystring = require('querystring');
import '../css/App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      mongodb: {
        user : "",
        password : "",
        url : "",
        port : 0,
        collection : ""
      },
      messageFromServer : "",
      connect: false,
      mongoConnectTry: false
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
          messageFromServer: response.data.message ? response.data.message : "Error while connection with MongoDB.",
          connect: response.data.result,
          mongoConnectTry: false
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
              {
                this.state.mongoConnectTry ?
                <div className="loadersmall"></div>
                :
                <div>{
                  this.state.messageFromServer && this.state.result ?
                   <h4 class="bg-success">{this.state.messageFromServer}</h4>
                   :
                   <h4 class="bg-danger">{this.state.messageFromServer}</h4>
                }</div>
              }
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
                  <small id="emailHelp" class="form-text text-muted">Provide MongoDB connection URL</small>
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
              </form>
            </div>
            <div className="col-md-6">
              <h2>MySQL</h2>
              <form>
                {/* mongodb://<dbuser>:<dbpassword>@ds253587.mlab.com:53587/ppsample */}
                <div class="form-group">
                  <label for="exampleInputEmail1">UserName</label>
                  <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter UserName"/>
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword1">Password</label>
                  <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"/>
                </div>
                <div class="form-group">
                  <label for="exampleInputEmail1">URL</label>
                  <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter URL"/>
                  <small id="emailHelp" class="form-text text-muted">Provide MongoDB connection URL</small>
                </div>
                <div class="form-group">
                  <label for="exampleInputEmail1">PORT</label>
                  <input type="number" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Port Number"/>
                </div>
                <div class="form-group">
                  <label for="exampleInputEmail1">Database</label>
                  <input type="text" class="form-control" id="exampleInputEmail1"  placeholder="Enter Collection Name"/>
                </div>
                <button type="submit" class="btn btn-primary">Connect</button>
              </form>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
export default App;

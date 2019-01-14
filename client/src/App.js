import React, { Component } from 'react';
import './App.css';
import {Header, Footer, Navbar, Login} from './components';


class App extends Component {
  state= {users: []}
  componentDidMount(){
    fetch('/users')
    .then(res=>res.json())
    .then(users=> this.setState({users}));
  }
  render() {
    return (
      <div className="App">
        {/* <Navbar /> */}
        <Login />
      </div>
    );
  }
}
export default App;
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './containers/Layout';
import * as actions from './store/actions/index';

import './App.css';

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    return <div className="App vh-100">
      <Layout />
    </div>;
  }
}

const mapStateToProps = state => ({ isAuthenticated: state.auth.token !== null });

const mapDispatchToProps = dispatch => ({
  onTryAutoSignup: () => dispatch(actions.authCheckState())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

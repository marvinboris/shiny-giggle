import React, { Component } from 'react';
import { withRouter, Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './containers/Layout';
import * as actions from './store/actions/index';

// Plan pages
import Subscription from './containers/Pages/Plans/Subscription';

// Calculation page
import CalculationPage from './containers/Pages/CalculationPage/CalculationPage';

// Auth pages
import Login from './containers/Pages/Auth/Login';
import SignUp from './containers/Pages/Auth/SignUp';
import SignUpSuccess from './containers/Pages/Auth/Success';
import Guest from './containers/Pages/Auth/Guest';
import Code from './containers/Pages/Auth/Code';
import Admin from './containers/Pages/Admin/Auth/Login';
import Verify from './containers/Pages/Admin/Auth/Verify';

// Payment pages
import Limo from './containers/Pages/Payment/Limo';
import Btc from './containers/Pages/Payment/Btc';
import Mobile from './containers/Pages/Payment/Mobile';
import PaymentSuccess from './containers/Pages/Payment/Success';

// Backend pages
import Notifications from './containers/Pages/Notifications';
import Notification from './containers/Pages/Notifications/Show';

import AdminDashboard from './containers/Pages/Admin/Dashboard/Dashboard';
import AdminUsers from './containers/Pages/Admin/Users';
import AdminAddUser from './containers/Pages/Admin/Users/Add';
import AdminSalesReport from './containers/Pages/Admin/Finances/SalesReport';
import AdminLimoPaymentEdit from './containers/Pages/Admin/Finances/Edit';
import AdminLimoPayments from './containers/Pages/Admin/Finances/LimoPayments';
import AdminCredits from './containers/Pages/Admin/Finances';
import AdminAddCredit from './containers/Pages/Admin/Finances/Add';
import AdminPlans from './containers/Pages/Admin/Plans';
import AdminAddPlan from './containers/Pages/Admin/Plans/Add';
import AdminPlanDeposit from './containers/Pages/Admin/Plans/Deposit';

import UserContactUsAdd from './containers/Pages/User/ContactUs/Add';
import UserDashboard from './containers/Pages/User/Dashboard/Dashboard';
import Plans from './containers/Pages/User/Subscription/Plans/Plans';
import Buy from './containers/Pages/User/Subscription/Buy/Buy';
import Calculate from './containers/Pages/User/Calculate/Calculate';

import './App.css';

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    const { auth: { data: { role } } } = this.props;
    const isAuthenticated = localStorage.getItem('token') !== null;

    let dashboard = null;
    switch (role) {
      case 'user':
        dashboard = UserDashboard;
        break;

      case 'admin':
        dashboard = AdminDashboard;
        break;

      default:
        break;
    }

    let routes = (
      <Switch>
        <Route path="/auth/admin/login" component={Admin} />
        <Route path="/auth/admin/verify" component={Verify} />
        <Redirect path="/admin" to="/auth/admin/login" />

        <Route path="/auth/guest" component={Guest} />
        <Route path="/auth/code" component={Code} />

        <Route path="/auth/register/success" component={SignUpSuccess} />
        <Route path="/auth/register" component={SignUp} />
        <Route path="/auth/login" component={Login} />

        <Redirect to={role === 'admin' ? "/admin" : "/auth/login"} />
      </Switch>
    );

    if (isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/notifications/:id" component={Notification} />
          <Route path="/notifications" component={Notifications} />

          <Route path="/dashboard" component={dashboard} />
          <Route path="/user/subscription/buy" component={Buy} />
          <Route path="/user/subscription/plans" component={Plans} />
          <Route path="/user/calculate" component={Calculate} />
          <Route path="/user/contact-us/add" component={UserContactUsAdd} />



          <Route path="/admin/users/add" component={AdminAddUser} />
          <Route path="/admin/users" component={AdminUsers} />

          <Route path="/admin/plans/deposit" component={AdminPlanDeposit} />
          <Route path="/admin/plans/add" component={AdminAddPlan} />
          <Route path="/admin/plans" component={AdminPlans} />

          <Route path="/admin/finances/sales-report" component={AdminSalesReport} />
          <Route path="/admin/finances/limo-payments/:id/edit" component={AdminLimoPaymentEdit} />
          <Route path="/admin/finances/limo-payments" component={AdminLimoPayments} />
          <Route path="/admin/finances/credits/add" component={AdminAddCredit} />
          <Route path="/admin/finances/credits" component={AdminCredits} />




          <Route path="/plans/:slug/payment/mobile" component={Mobile} />
          <Route path="/plans/:slug/payment/btc" component={Btc} />
          <Route path="/plans/:slug/payment/limo" component={Limo} />

          <Route path="/plans" component={Subscription} />

          <Route path="/payment/success" component={PaymentSuccess} />
          <Route path="/calculation" component={CalculationPage} />

          <Redirect to="/calculation" />
        </Switch>
      );
    }

    return <div className="App vh-100">
      <Layout>{routes}</Layout>
    </div>;
  }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
  onTryAutoSignup: () => dispatch(actions.authCheckState())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

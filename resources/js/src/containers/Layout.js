import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import ErrorBoundary from './ErrorBoundary';

// Plan pages
import Subscription from './Pages/Plans/Subscription';

// Calculation page
import CalculationPage from './Pages/CalculationPage/CalculationPage';

// Auth pages
import Login from './Pages/Auth/Login';
import SignUp from './Pages/Auth/SignUp';
import SignUpSuccess from './Pages/Auth/Success';
import Guest from './Pages/Auth/Guest';
import Code from './Pages/Auth/Code';
import Admin from './Pages/Admin/Auth/Login';
import Verify from './Pages/Admin/Auth/Verify';

// Payment pages
import Limo from './Pages/Payment/Limo';
import Btc from './Pages/Payment/Btc';
import Mobile from './Pages/Payment/Mobile';
import PaymentSuccess from './Pages/Payment/Success';

// Backend pages
import AdminDashboard from './Pages/Admin/Dashboard/Dashboard';
import AdminUsers from './Pages/Admin/Users';
import AdminSalesReport from './Pages/Admin/Finances/SalesReport';
import AdminCredits from './Pages/Admin/Finances';
import AdminAddCredit from './Pages/Admin/Finances/Add';
import AdminPlans from './Pages/Admin/Plans';

import UserDashboard from './Pages/User/Dashboard/Dashboard';
import Plans from './Pages/User/Subscription/Plans/Plans';
import Buy from './Pages/User/Subscription/Buy/Buy';
import Calculate from './Pages/User/Calculate/Calculate';

class Layout extends Component {
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

        let routes = <Switch>
            <Route path="/auth/admin/login" component={Admin} />
            <Route path="/auth/admin/verify" component={Verify} />
            <Redirect path="/admin" to="/auth/admin/login" />

            <Route path="/auth/guest" component={Guest} />
            <Route path="/auth/code" component={Code} />

            <Route path="/auth/register/success" component={SignUpSuccess} />
            <Route path="/auth/register" component={SignUp} />
            <Route path="/auth/login" component={Login} />
            
            <Redirect to={role === 'admin' ? "/admin" : "/auth/login"} />
        </Switch>;

        if (isAuthenticated) routes = <Switch>
            <Route path="/dashboard" component={dashboard} />
            <Route path="/user/subscription/buy" component={Buy} />
            <Route path="/user/subscription/plans" component={Plans} />

            <Route path="/admin/users" component={AdminUsers} />
            <Route path="/admin/plans" component={AdminPlans} />
            <Route path="/admin/finances/sales-report" component={AdminSalesReport} />
            <Route path="/admin/finances/credits/add" component={AdminAddCredit} />
            <Route path="/admin/finances/credits" component={AdminCredits} />

            <Route path="/user/calculate" component={Calculate} />

            <Route path="/plans/:slug/payment/mobile" component={Mobile} />
            <Route path="/plans/:slug/payment/btc" component={Btc} />
            <Route path="/plans/:slug/payment/limo" component={Limo} />

            <Route path="/plans" component={Subscription} />

            <Route path="/payment/success" component={PaymentSuccess} />
            <Route path="/calculation" component={CalculationPage} />

            <Redirect to="/calculation" />
        </Switch>;

        return <ErrorBoundary>
            {routes}
        </ErrorBoundary>;
    }
};

const mapStateToProps = state => ({ ...state });

export default connect(mapStateToProps)(Layout);
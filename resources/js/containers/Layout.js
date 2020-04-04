import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';


import DepositSuccess from './Pages/depositSuccess/DepositSuccess';
import Home from './Pages/HomePage/Home';
//import CalculeGain from './CalculeGain/CalculeGain';
import LiyepUser from './Pages/CustomerLoginPage/LiyepUser';
import SubscribPage from './Pages/SubsCribPage/SubscribPage';
import PayementPage from './Pages/PaymentPage/PayementPage';
import CalculationPage from './Pages/CalculationPage/CalculationPage';

class Layout extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/Login" component={LiyepUser} />
                    <Route path="/subscrib" component={SubscribPage} />
                    <Route path="/payement" component={PayementPage} />
                    <Route path="/deposit" component={DepositSuccess} />
                    <Route path="/" component={Home} />
                </Switch>
            </div>
        )
    }
}

export default Layout;
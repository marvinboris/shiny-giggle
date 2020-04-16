import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';

import Footer from '../components/Footer/Footer';
import AppBar from '../components/AppBar/AppBar';

import Subscription from './Pages/Subscribtion/Subscription';
import CalculationPage from './Pages/CalculationPage/CalculationPage';

// Auth pages
import Login from './Pages/Auth/Login';
import SignUp from './Pages/Auth/SignUp';
import Guest from './Pages/Auth/Guest';

// Payment pages
import Limo from './Pages/Payment/Limo';
import Btc from './Pages/Payment/Btc';
import Mobile from './Pages/Payment/Mobile';
import Success from './Pages/Payment/Success';

import CustomSpinner from '../components/UI/CustomSpinner/CustomSpinner';

import { authLogout } from '../store/actions';

class Layout extends Component {
    render() {
        const { auth: { loading }, onAuthLogout } = this.props;
        const isAuthenticated = localStorage.getItem('token') !== null;
        console.log({ loading })

        let routes = <Switch>
            <Route path="/auth/register" component={SignUp} />
            <Route path="/auth/guest" component={Guest} />
            <Route path="/auth/login" component={Login} />
            <Redirect to="/auth/login" />
        </Switch>;

        if (isAuthenticated) routes = <Switch>
            <Route path="/plans/:slug/payment/mobile" component={Mobile} />
            <Route path="/plans/:slug/payment/btc" component={Btc} />
            <Route path="/plans/:slug/payment/limo" component={Limo} />

            <Route path="/plans" component={Subscription} />

            <Route path="/success" component={Success} />
            <Route path="/calculation" component={CalculationPage} />

            <Redirect to="/plans" />
        </Switch>;

        return <div className="vh-100 d-flex flex-column">
            <AppBar isAuthenticated={isAuthenticated} logout={onAuthLogout} />
            <div className="flex-fill overflow-hidden bg-darkblue">
                <div className="h-100">
                    <Container fluid className="h-100">
                        <Row className="justify-content-center h-100">
                            {loading ? <div className="h-100 d-flex justify-content-center align-items-center"><CustomSpinner /></div> : <Col xs={10} className="d-flex flex-column h-100">
                                {routes}
                            </Col>}
                        </Row>
                    </Container>
                </div>
            </div>
            <Footer />
        </div>;
    }
};

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onAuthLogout: () => dispatch(authLogout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
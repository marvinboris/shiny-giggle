import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import AppBar from '../components/AppBar/AppBar';
import CustomSpinner from '../components/UI/CustomSpinner/CustomSpinner';
import Footer from '../components/Footer/Footer';

import { authLogout } from '../store/actions';

import LogoHeader from '../assets/images/logo-header.png';

class FrontEnd extends Component {
    dashboard = () => {
        this.props.history.push('/dashboard');
    }

    render() {
        const { auth: { loading, role }, onAuthLogout, children } = this.props;
        const isAuthenticated = localStorage.getItem('token') !== null;

        return <div className="vh-100 d-flex flex-column">
            <AppBar isAuthenticated={isAuthenticated} role={role} logout={onAuthLogout} dashboard={this.dashboard} />
            <div className="flex-fill overflow-hidden position-relative bg-darkblue">
                <div className="d-sm-none position-absolute w-100 text-center" style={{ top: 100, left: 0, opacity: .1 }}>
                    <img src={LogoHeader} width={145} />
                </div>

                <div className="h-100">
                    <Container fluid className="h-100">
                        <Row className="justify-content-center h-100">
                            {loading ? <div className="h-100 d-flex justify-content-center align-items-center"><CustomSpinner /></div> : <Col lg={10} className="d-flex justify-content-sm-start justify-content-center flex-column h-100">
                                {children}
                            </Col>}
                        </Row>
                    </Container>
                </div>
            </div>
            <Footer />
        </div>;
    }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onAuthLogout: () => dispatch(authLogout())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FrontEnd));
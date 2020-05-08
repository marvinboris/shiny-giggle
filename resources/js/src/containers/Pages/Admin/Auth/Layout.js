import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import Footer from '../../../../components/Footer/Footer';

import Logo from '../../../../assets/images/logo-header.png';

export default ({ children }) => <div className="vh-100 d-flex flex-column">
    <div className="flex-fill overflow-hidden bg-darkblue">
        <div className="h-100">
            <Container fluid className="h-100">
                <Row className="justify-content-center h-100">
                    <Col xl={10} className="d-flex flex-column justify-content-center h-100">
                        <Row className="justify-content-center">
                            <Col xl={3}>
                                <img src={Logo} alt="Logo" className="img-fluid mx-auto w-60 mb-5 d-none d-sm-block" style={{ opacity: .5 }} />

                                <div className="mt-3">{children}</div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    </div>
    <Footer />
</div>
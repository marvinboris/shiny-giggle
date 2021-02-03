import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-regular-svg-icons'
import { Row, Col, Container } from 'reactstrap';

import Logo from '../../assets/images/logo-footer.png';

export default class Footer extends Component {
    render() {
        return (
            <div className="d-none d-sm-block bg-darkblue border-top border-yellow-50 py-3">
                <Container>
                    <Row className="justify-content-center">
                        <Col xs={11} className="text-left">
                            {/* <img src={Logo} width={341} alt="Logo" /> */}
                            <p className="m-0 text-left text-light"><FontAwesomeIcon className="text-yellow" icon={faCopyright} /> <span className="text-secondary">Copyright  2020</span> <strong>Liyeplimal Reinvestment System Calculator.</strong> <span className="text-secondary">All rights reserved by</span> <strong className="text-yellow">Limocalc</strong>. Developed by <strong className="text-lightblue">Briluce Services</strong>.</p>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

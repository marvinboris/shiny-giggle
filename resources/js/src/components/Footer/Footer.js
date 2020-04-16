import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-regular-svg-icons'
import { Row, Col, Container } from 'reactstrap';

import Logo from '/invest-laravel/images/Group 13@2x.png';

export default class Footer extends Component {
    render() {
        return (
            <div className="bg-darkblue border-top border-yellow pt-3">
                <Container>
                    <Row>
                        <Col xs={{ size: 9, offset: 1 }} className="text-left">
                            <img src={Logo} width={341} alt="Logo" />
                            <p className="mt-4 text-left text-light"><FontAwesomeIcon className="text-yellow" icon={faCopyright} /> <span className="text-secondary">Copyright  2020</span> <strong>Liyeplimal Reinvestment System Calculator.</strong> <span className="text-secondary">All rights reserved by</span> <strong className="text-yellow">Briluce Services</strong>.</p>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

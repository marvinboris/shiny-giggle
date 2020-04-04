import React, { Component } from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChartLine,faMoneyBillWave} from '@fortawesome/free-solid-svg-icons'
import {faCopyright} from '@fortawesome/free-regular-svg-icons'
import { Row, Col, Container } from 'reactstrap';
export default class Footer extends Component {
    render() {
        return (
            <div >
                <hr className=" bg-secondary h-line w-100 " />
                <Container>
                <Row>
                <Col xs={{size:9,offset:1}}>    
                <h2 className="text-left">
                    <strong className="footer-text-1 text-light"><FontAwesomeIcon color="#f5a10e" icon={faMoneyBillWave} /> INVEST</strong>
                    <strong className="navbar-text-2"> CALC <FontAwesomeIcon icon={faChartLine} /></strong>
                   
                </h2> 
                <p className="mt-4 text-left text-light"><FontAwesomeIcon className="text-warning" icon={faCopyright} /> <strong className="text-secondary">Copyright  2020</strong> <strong>Liyeplimal Reinvestment System Calculator.</strong> <strong className="text-secondary">All right rights reserved.</strong> <strong className="text-warning">By Briluce Services</strong>.</p>
                    </Col>
                </Row>
                </Container>
            </div>
        )
    }
}

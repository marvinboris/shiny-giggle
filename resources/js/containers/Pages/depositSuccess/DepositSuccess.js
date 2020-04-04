import React, { Component } from 'react'
import AppBar from '../../../components/AppBar/AppBar'
import { Container, Row,Col,Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faCheckCircle, } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default class DepositSuccess extends Component {
    render() {
        return (
            <div>
                <style>
                    {
                        `.dot-warning{
                            height: 10px;
                            width: 10px;
                            top:-21px;
                            left: 80px;
                        }`
                    }
                </style>
                <AppBar/>
                <Container>
                    <Row>
                        <Col className=" home-page mb-5 mt-5" xs={{size:6 , offset:3}}>
                            <h4 className="text-left text-light"> Thank you for your payment ! You may start using our service</h4>
                            <div className="inderline">
                                <hr className="bg-secondary"/>
                                <div className="dot-warning bg-warning rounded-circle position-relative"></div>
                            </div>
                        </Col>
                        <Col className="mt-5 mb-5" xs={{size:6,offset:3}}>
                            <FontAwesomeIcon icon={faCheckCircle} color="#06b640" size="10x" />
                        </Col>
                        <br/>
                        <Col className="mt-5" xs={{size:6,offset:3}}>
                            <Link to="/">
                                <Button  style={{backgroundColor: "#06B0B6"}}   size=" w-50 h-100">
                                        <h5 className="mt-3 mb-3" >Start now <FontAwesomeIcon icon={faChevronRight}/><FontAwesomeIcon icon={faChevronRight}/></h5>
                                </Button>
                            </Link>

                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

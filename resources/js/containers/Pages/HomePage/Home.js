import React, { Component } from 'react';
import AppBar from '../../../components/AppBar/AppBar';
import { Container, Row, Col } from 'reactstrap';
import "./Home.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheckCircle, faTimesCircle, faUser} from "@fortawesome/free-solid-svg-icons";
import Footer from '../../../components/Footer/Footer';
import { Link} from 'react-router-dom'



export class Home extends Component {
    render() {
        return (
            <div>
               <AppBar/>
               <Container className="login-section">
                   <Row className="">
                       <Col className="home-page mb-5" xs={7}>
                           <h4 className="text-left text-light">Want to know what you wil gain while investing <br/>in Liyeplimal ?</h4>
                           <div className="inderline">
                             <hr className="bg-secondary"/>
                             <div className="dot-warning bg-warning rounded-circle position-relative"></div>
                           </div>
                       </Col>
                       <Col xs={12}>
                           <Row>
                              <Col className="mt-5 section-1" xs={3 }>
                                <h2 className="text-light text-center ">
                                    I am
                                </h2>
                                <Link to ="/login">
                                    <div className="mt-5 section-btn bg-success">
                                        <p className="home-btn-text text-light">A Liyeplimal<br/>Customer</p>
                                        <div className="v-line  position-relative"></div>
                                        <div className="hr-line  position-relative"></div>
                                        <div className="check-icon"><FontAwesomeIcon size="2x" color="white" icon={faCheckCircle}  /> </div>
                                    </div>
                                </Link>
                              </Col>
                              <Col className="mt-5 section-1" xs={{size:3,offset:1}}>
                                <h2 className="text-light text-center ">
                                    I am
                                </h2>
                                <Link to ="/home">
                                    <div className="mt-5 section-btn bg-danger">
                                        <p className="home-btn-text text-light">Not a Liyeplimal<br/>Customer</p>
                                        <div className="v-line  position-relative"></div>
                                        <div className="hr-line  position-relative"></div>
                                        <div className="check-icon"><FontAwesomeIcon size="2x" color="white" icon={faTimesCircle}  /> </div>
                                    </div>
                                </Link>
                              </Col>
                              <Col className="mt-5 section-1" xs={{size:3,offset:1}}>
                                <h2 className="text-light text-center ">
                                    I am
                                </h2>
                                <Link to ="/login">
                                    <div style={{backgroundColor:'#f5a10e'}} className="mt-5 section-btn">
                                        <p className="home-btn-text text-light">Continue as<br/>guest</p>
                                        <div className="v-line  position-relative"></div>
                                        <div className="user-icon"><FontAwesomeIcon size="2x" color="white" icon={faUser} /></div>
                                    </div>
                                </Link>
                              </Col>
                              
                           </Row>
                       </Col>
                   </Row>
               </Container>
               <Footer />
               
            </div>
        )
    }
}

export default Home

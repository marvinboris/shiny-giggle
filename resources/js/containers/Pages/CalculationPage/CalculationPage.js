import React, { Component } from 'react'
import AppBar from '../../../components/AppBar/AppBar'
import { Badge, Row, Col, Jumbotron } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import ResultCard from "../../../components/UI/ResultCard"

export default class CalculationPage extends Component {
    render() {
        const data=[1,2,3,4,5,6,7,8];
        let result = data.map(d =>  <ResultCard week={3} payout={0} balw={34} totBal={0}  invest="can't" rem={0}  bg="#73EC2"  />)
        return (
            <div>
                <style>
                    {
                        `
                        .paye-v-line{
                            font-family: 'Montserrat', sans-serif;
                            height: 500px;
                            width: 1px;
                            background-color: rgba(243, 243, 243, 0.658)!important;
                            margin-left:90px;
                        }
                        p{
                            line-height:8px;
                        }
                        .badge{
                            position:absolute;
                            left:45px!important;
                        }
                        `
                    }
                </style>
                <AppBar/>
                    <Row className="m-5">
                        <Col className="home-page mb-5" xs={4}>
                            <h4 className="text-left text-light">Please fill the form below to get started to proceed</h4>
                            <div className="inderline w-75">
                                <hr className="bg-secondary"/>
                                <div className="dot-warning bg-warning rounded-circle position-relative"></div>
                            </div>
                        </Col>
                        <Col xs={1}><div className="paye-v-line float-left"></div></Col>
                        <Col xs={7}>
                            <Jumbotron className="">
                               <Row>
                                  {result}  
                               </Row>
                               <Row>
                                   <Col className="float-left" xs={10}>
                                       <br/>
                                       <h5 className=" float-left">Balance after 8 weeks of continuous investment : <span className=" text-success" >$24.84</span></h5>
                                   </Col>
                                   <Col xs={{size:3,offset:8}}>
                                   <nav className="float-end" aria-label="Page navigation example">
                                        <ul class="pagination">
                                            <li class="bg-warning page-item"><a class="bg-warning text-light page-link d-inline-flex align-items-end" href="#"><FontAwesomeIcon icon={faChevronLeft}/><FontAwesomeIcon icon={faChevronLeft}/><span className="ml-2">Prev</span></a></li>
                                            <li  class="page-item border-0"><a style={{backgroundColor:'#e9ecef',color:'black'}} class=" page-link" href="#">1</a></li>
                                            <li class="page-item"><a style={{backgroundColor:'#e9ecef'}} class="text-secondary page-link" href="#">2</a></li>
                                            <li class="page-item"><a style={{backgroundColor:'#e9ecef'}} class="text-secondary page-link" href="#">3</a></li>
                                            <li class="page-item"><a class="bg-primary text-light page-link d-inline-flex align-items-end" href="#"><span className="mr-2">Next</span><FontAwesomeIcon icon={faChevronRight}/><FontAwesomeIcon icon={faChevronRight}/></a></li>
                                        </ul>
                                    </nav>
                                   </Col>
                               </Row>
                            </Jumbotron>
                        </Col>
                    </Row>
                
            </div>
        )
    }
}

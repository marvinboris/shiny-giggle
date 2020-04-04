import React, { Component } from 'react'
import AppBar from '../../../components/AppBar/AppBar'
import Footer from '../../../components/Footer/Footer'
import { Container, Row, Col } from 'reactstrap';
import plan_1 from '../../../assets/images/plan-1.png';
import plan_2 from '../../../assets/images/plan-2.png';
import plan_3 from '../../../assets/images/plan-3.png';
import mansee from '../../../assets/images/mansee.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import { Redirect } from 'react-router-dom';

class SubscribPage extends Component {

    render() {
        let authRedirect = null;
        if (!this.props.isAuthenticated) {
            authRedirect = <Redirect to='/login' />
        }
        let link ="/"
        if(this.props.links){
            console.log('Link is ' +this.props.links)
        }
        return (
            
            <div>
                {authRedirect}
                <style>
                    {
                        `
                        .dot-warning{
                            height: 10px;
                            width: 10px;
                            top:-21px;
                            left: 80px;
                        }
                        .subs-v-line{
                            font-family: 'Montserrat', sans-serif;
                            height: 500px;
                            width: 1px;
                            background-color: rgba(243, 243, 243, 0.658)!important;
                        }
                        
                        .plan-1{
                            margin-top:50px;
                        }
                        
                        `
                    }
                </style>
                <AppBar />
                <Container className="mb-5">
                    <Row>
                        <Col xs={1}>
                            <FontAwesomeIcon className="w-50 h-50 text-right m-0 p-0" color="#06b640" icon={faCheckCircle} />
                        </Col>
                        <Col className=" home-page mb-5" xs={5}>
                            <h4 className="text-left text-light"> Good Job ! Welcome  Guest. Please select a plan to get started</h4>
                            <div className="inderline">
                                <hr className="bg-secondary" />
                                <div className="dot-warning bg-warning rounded-circle position-relative"></div>
                            </div>
                        </Col>
                        <Col xs={9}>
                            <Row >
                                <Col className="plan-1" xs={4}>
                                    <a href='payement'><img alt="plan" src={plan_1} /></a>
                                </Col>
                                <Col xs={4}>
                                    <a href="/payement"><img alt="plan" src={plan_2} /></a>
                                </Col>
                                <Col className="mt-5" xs={4}>
                                    <a href="/payement"> <img alt="plan" src={plan_3} /></a>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={1}>
                            <div className="subs-v-line ml-4 float-left"></div>
                        </Col>
                        <Col xs={2}>
                            <img alt="mansee" src={mansee} />
                        </Col>
                    </Row>
                </Container>
                <Footer />
            </div>
        )
    }
}

const mapStateToProps = state => {
    console.log(state.auth);
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubscribPage);
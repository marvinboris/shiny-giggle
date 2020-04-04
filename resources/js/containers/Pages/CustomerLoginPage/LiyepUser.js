import React, { Component } from 'react'
import AppBar from '../../../components/AppBar/AppBar'
import { Container, Row, Col, Form, InputGroup, InputGroupAddon, InputGroupText, Input, Button, Label, FormGroup } from 'reactstrap';
import './LiyepUser.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import mancompute from '../../../assets/images/man-compute.png';
import Footer from '../../../components/Footer/Footer';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import { Redirect } from 'react-router-dom';

class LiyepUser extends Component {
    state = {
        form: {
            email: '',
            phone: ''
        }
    }

    submitHandler = e => {
        e.preventDefault();
        this.props.onAuth(e.target, true);
        console.log(this.props.isAuthenticated)
    }

    inputChangeHandler = (e, name) => {
        this.setState({ [name]: e.target.value });
    }

    render() {
        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }

        return (
            <div>
                {authRedirect}
                <AppBar />

                <Container className="login-section mb-5" >
                    <Row className="">
                        <Col className="home-page mb-5" xs={6}>
                            <h4 className="text-left text-light">Please provide the required information<br />to proceed</h4>
                            <div className="inderline">
                                <hr className="bg-secondary" />
                                <div className="dot-warning bg-warning rounded-circle position-relative"></div>
                            </div>
                        </Col>
                        <Col xs={12}>
                            <Row>
                                <Col xs={5}>
                                    <Form onSubmit={this.submitHandler} >
                                        <FormGroup>
                                            <InputGroup size='lg outline-0'>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText style={{ border: '0' }} className="user-input bg-dark" ><FontAwesomeIcon color="white" icon={faUser} /></InputGroupText>
                                                </InputGroupAddon>
                                                <Input onChange={(e) => this.inputChangeHandler(e, "email")} name="email" required className="text-light bg-dark border-0 " placeholder="Liyeplimal ID" />
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup>
                                            <InputGroup className="text-left" size="lg">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText style={{ border: 'none' }} className="bg-dark"><FontAwesomeIcon color="white" icon={faLock} /></InputGroupText>
                                                </InputGroupAddon>
                                                <Input onChange={(e) => this.inputChangeHandler(e, "phone")} name="phone" required type="password" className="bg-dark border-0 text-light" placeholder="Password" />
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup className="ml-2">
                                            <InputGroup className="ml-2" check>
                                                <Label className="text-secondary ml-1" check>
                                                    <Input required type="checkbox" />I accept the terms and conditions. All your info are encrypted
                                                </Label>
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup>
                                            <Button style={{ backgroundColor: "#06b0b6" }} className="float-left" size=" w-50 h-25">
                                                <h3 >proceed <FontAwesomeIcon icon={faChevronRight} /><FontAwesomeIcon icon={faChevronRight} /></h3>
                                            </Button>
                                        </FormGroup>
                                    </Form>
                                </Col>
                                <Col xs={1}>
                                    <div className="liyep-v-line ml-5 float-right"></div>
                                </Col>
                                <Col xs={6}>
                                    <img className="ml-5 float-right img-fluid" alt="mancompute" src={mancompute} />
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

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (data, isSignup) => dispatch(actions.auth(data, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LiyepUser);
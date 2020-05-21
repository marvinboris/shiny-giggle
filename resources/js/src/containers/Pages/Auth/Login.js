import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Form, FormGroup, Row, Label, Input, Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import { faUser, faLock, faSignInAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Layout from './Layout';

import FormInput from '../../../components/UI/FormInput/FormInput';
import FormButton from '../../../components/UI/FormButton/FormButton';
import Error from '../../../components/Error/Error';
import Feedback from '../../../components/Feedback/Feedback';

import * as actions from '../../../store/actions/index';

export class Home extends Component {
    state = {
        ref: '',
        password: '',
        modal: false
    }

    toggle = () => {
        this.setState(prevState => ({ modal: !prevState.modal }));
    }

    submitHandler = e => {
        e.preventDefault();
        this.props.onAuth(e.target);
    }

    forgotPassword = e => {
        e.preventDefault();
        this.props.onForgotPassword(e.target);
    }

    inputChangeHandler = (e, name) => {
        this.setState({ [name]: e.target.value });
    }

    render() {
        const { auth: { error, message } } = this.props;
        const errors = <Error err={error} />;
        const feedback = <Feedback message={message} />;
        return (
            <Layout getIn>
                {errors}
                <Row>
                    <Form onSubmit={this.submitHandler} className="col-lg-6">
                        {feedback}
                        <FormInput type="text" icon={faUser} onChange={(e) => this.inputChangeHandler(e, "ref")} value={this.state.ref} name="ref" required placeholder="Email or username" />
                        <FormInput type="password" icon={faLock} onChange={(e) => this.inputChangeHandler(e, "password")} value={this.state.password} name="password" required placeholder="Password" />
                        <FormGroup className="ml-2 mb-5 mt-4">
                            <p className="text-light text-right">Forgot password ? <strong className="text-yellow" onClick={this.toggle} style={{ cursor: 'pointer' }}>Reset here</strong></p>
                        </FormGroup>
                        <FormButton color="yellow" icon={faSignInAlt}>Sign In</FormButton>
                        {/* <p className="text-center"><Link to="/auth/code" className="text-yellow">I have a code</Link></p> */}
                    </Form>
                </Row>

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Forgot password</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.forgotPassword}>
                            <FormGroup>
                                <Label>E-mail address</Label>
                                <Input type="email" name="email" />
                            </FormGroup>
                            <Button color="lightblue">Send Link<FontAwesomeIcon icon={faPaperPlane} className="ml-2" /></Button>
                        </Form>
                    </ModalBody>
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onAuth: data => dispatch(actions.authLogin(data)),
    onForgotPassword: data => dispatch(actions.forgotPassword(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Form, FormGroup, CustomInput, Label } from 'reactstrap';
import { faUser, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

import FormInput from '../../../components/UI/FormInput/FormInput';
import FormButton from '../../../components/UI/FormButton/FormButton';
import Layout from './Layout';

import * as actions from '../../../store/actions/index';

export class SignUp extends Component {
    state = {
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        country: '',
        phone: '',
        password: '',
        password_confirm: '',
        terms: false,
    }

    submitHandler = e => {
        e.preventDefault();
        this.props.onAuth(e.target);
    }

    inputChangeHandler = (e, name) => {
        this.setState({ [name]: e.target.value });
    }

    render() {
        return (
            <Layout signUp>
                <Form onSubmit={this.submitHandler} className="row">
                    <FormInput type="text" className="col-6" icon={faUser} onChange={(e) => this.inputChangeHandler(e, "first_name")} value={this.state.first_name} name="first_name" required placeholder="First name" />
                    <FormInput type="text" className="col-6" icon={faUser} onChange={(e) => this.inputChangeHandler(e, "last_name")} value={this.state.last_name} name="last_name" required placeholder="Last name" />
                    <FormInput type="text" className="col-6" icon={faUser} onChange={(e) => this.inputChangeHandler(e, "username")} value={this.state.username} name="username" required placeholder="Username" />
                    <FormInput type="email" className="col-6" icon={faEnvelope} onChange={(e) => this.inputChangeHandler(e, "email")} value={this.state.email} name="email" required placeholder="Email" />
                    <FormInput type="select" className="col-6" addon={<span className="text-white text-small d-inline-flex">
                        <div className="border border-1 border-white rounded-circle overflow-hidden position-relative d-flex justify-content-center align-items-center mr-2" style={{ width: 20, height: 20 }}>
                            <span className={`flag-icon text-large position-absolute flag-icon-cm`} />
                        </div>

                        CM
                    </span>} onChange={(e) => this.inputChangeHandler(e, "country")} value={this.state.country} name="country" required placeholder="Select your country">
                        <option>Select your country</option>
                        <option value="cm" code="237">Cameroon</option>
                    </FormInput>
                    <FormInput type="tel" className="col-6" addon={<span className="text-white text-small">+237</span>} onChange={(e) => this.inputChangeHandler(e, "phone")} value={this.state.phone} name="phone" required placeholder="Phone" />
                    <FormInput type="password" className="col-6" icon={faLock} onChange={(e) => this.inputChangeHandler(e, "password")} value={this.state.password} name="password" required placeholder="Password" />
                    <FormInput type="password" className="col-6" icon={faLock} onChange={(e) => this.inputChangeHandler(e, "password_confirm")} value={this.state.password_confirm} name="password_confirm" required placeholder="Repeat Password" />
                    <FormGroup className="ml-2 mb-5 mt-4 col-12 text-light text-left">
                        <Label check>
                            <CustomInput type="checkbox" id="terms" onChange={e => this.inputChangeHandler(e, 'terms')} value={this.state.terms} name="terms" label="Accept terms and conditions" inline />
                        </Label>
                    </FormGroup>
                    <FormGroup className="col-6">
                        <FormButton color="yellow" icon={faSignInAlt}>Sign Up</FormButton>
                    </FormGroup>
                </Form>
            </Layout>
        )
    }
}

const mapStateToProps = state => ({
    token: state.auth.token,
});

const mapDispatchToProps = dispatch => ({
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/plans')),
    onAuth: data => dispatch(actions.authSignup(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
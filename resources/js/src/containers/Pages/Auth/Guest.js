import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Form, FormGroup, Label, CustomInput } from 'reactstrap';
import { faUser, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

import FormInput from '../../../components/UI/FormInput/FormInput';
import FormButton from '../../../components/UI/FormButton/FormButton';
import Layout from './Layout';

import * as actions from '../../../store/actions/index';

export class Guest extends Component {
    state = {
        name: '',
        email: '',
        country: '',
        phone: '',
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
            <Layout guest>
                <Form onSubmit={this.submitHandler} className="row">
                    <FormInput type="text" className="col-6" icon={faUser} onChange={(e) => this.inputChangeHandler(e, "name")} value={this.state.name} name="name" required placeholder="Full name" />
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
                    <FormGroup className="ml-2 mb-5 mt-4 col-12 text-light text-left">
                        <Label check>
                            <CustomInput type="checkbox" id="terms" onChange={e => this.inputChangeHandler(e, 'terms')} value={this.state.terms} name="terms" label="Accept terms and conditions" inline />
                        </Label>
                    </FormGroup>
                    <FormGroup className="col-6">
                        <FormButton color="yellow" icon={faSignInAlt}>Continue</FormButton>
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
    onAuth: data => dispatch(actions.authGuestSignup(data))
});


export default connect(mapStateToProps, mapDispatchToProps)(Guest);
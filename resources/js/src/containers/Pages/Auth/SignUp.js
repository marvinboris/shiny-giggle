import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Form, FormGroup, CustomInput, Label, Row, Col } from 'reactstrap';
import { faUser, faLock, faSignInAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

import FormInput from '../../../components/UI/FormInput/FormInput';
import FormButton from '../../../components/UI/FormButton/FormButton';
import CustomSpinner from '../../../components/UI/CustomSpinner/CustomSpinner';
import Error from '../../../components/Error/Error';
import Layout from './Layout';

import * as actions from '../../../store/actions/index';
import { Redirect } from 'react-router-dom';

export class SignUp extends Component {
    state = {
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        country: 'CM',
        code: '237',
        phone: '',
        password: '',
        password_confirmation: '',
        terms: false,

        countries: [],
        page: 1
    }

    async componentDidMount() {
        const phoneRes = await fetch(CORS + 'http://country.io/phone.json', { method: 'GET', mode: 'cors' });
        const namesRes = await fetch(CORS + 'http://country.io/names.json', { method: 'GET', mode: 'cors' });

        const phone = await phoneRes.json();
        const names = await namesRes.json();

        const countries = Object.keys(phone).map(key => ({ country: key, code: phone[key], name: names[key] })).sort((a, b) => a.country > b.country);

        this.setState({ countries });
    }

    submitHandler = e => {
        e.preventDefault();
        this.props.onAuth(e.target);
    }

    goToPage = page => {
        this.setState({ page });
    }

    inputChangeHandler = e => {
        const { name, value, checked } = e.target;
        if (name === 'country') return this.setState({ country: value, code: this.state.countries.find(({ country }) => country === value).code });
        if (name === 'terms') return this.setState({ terms: checked });
        this.setState({ [name]: value });
    }

    render() {
        const { signup: { status }, loading, error } = this.props;
        const { countries, first_name, last_name, username, email, code, country, password, password_confirmation, phone, terms, page } = this.state;

        let errors;
        if (error) errors = <Error err={error} />;

        let redirect = null;
        if (status) redirect = <Redirect to="/auth/register/success" />;

        let content;
        if (countries.length === 0 || loading) content = <CustomSpinner />;
        else {
            const countriesOptions = countries.map(({ country, code, name }) => <option key={country} value={country} code={code}>{name}</option>);

            content = <Form onSubmit={this.submitHandler} className="row">
                <Col xs={12} className={`d-${page === 1 ? 'block' : 'none'} d-sm-block`}>
                    <Row>
                        <FormInput type="text" className="col-md-6" icon={faUser} onChange={this.inputChangeHandler} value={first_name} name="first_name" required placeholder="First name" />
                        <FormInput type="text" className="col-md-6" icon={faUser} onChange={this.inputChangeHandler} value={last_name} name="last_name" required placeholder="Last name" />
                        
                        <FormGroup className="d-sm-none mt-5 col-md-6 mb-0 pb-0">
                            <FormButton type="button" onClick={() => this.goToPage(2)} color="yellow" icon={faSignInAlt}>Next</FormButton>
                        </FormGroup>
                    </Row>
                </Col>

                <Col xs={12} className={`d-${page === 2 ? 'block' : 'none'} d-sm-block`}>
                    <Row>
                        <FormInput type="text" className="col-md-6" icon={faUser} onChange={this.inputChangeHandler} value={username} name="username" required placeholder="Username" />
                        <FormInput type="email" className="col-md-6" icon={faEnvelope} onChange={this.inputChangeHandler} value={email} name="email" required placeholder="Email" />
                        
                        <FormGroup className="d-sm-none mt-5 col-md-6 mb-0 pb-0">
                            <FormButton type="button" onClick={() => this.goToPage(3)} color="yellow" icon={faSignInAlt}>Next</FormButton>
                        </FormGroup>
                        <FormGroup className="d-sm-none col-md-6">
                            <FormButton type="button" onClick={() => this.goToPage(1)} color="lightblue" before icon={faArrowLeft}>Previous</FormButton>
                        </FormGroup>
                    </Row>
                </Col>

                <Col xs={12} className={`d-${page === 3 ? 'block' : 'none'} d-sm-block`}>
                    <Row>
                        <FormInput type="select" className="col-md-6" addon={<span className="text-white text-small d-inline-flex">
                            <div className="border border-1 border-white rounded-circle overflow-hidden position-relative d-flex justify-content-center align-items-center mr-2" style={{ width: 20, height: 20 }}>
                                <span className={`flag-icon text-large position-absolute flag-icon-${country.toLowerCase()}`} />
                            </div>

                            {country.toUpperCase()}
                        </span>} onChange={this.inputChangeHandler} value={country} name="country" required placeholder="Select your country">
                            <option>Select your country</option>
                            {countriesOptions}
                        </FormInput>
                        <input type="hidden" value={code} name="code" />
                        <FormInput type="tel" className="col-md-6" addon={<span className="text-white text-small">+{code}</span>} onChange={this.inputChangeHandler} value={phone} name="phone" required placeholder="Phone" />
                        
                        <FormGroup className="d-sm-none mt-5 col-md-6 mb-0 pb-0">
                            <FormButton type="button" onClick={() => this.goToPage(4)} color="yellow" icon={faSignInAlt}>Next</FormButton>
                        </FormGroup>
                        <FormGroup className="d-sm-none col-md-6">
                            <FormButton type="button" onClick={() => this.goToPage(2)} color="lightblue" before icon={faArrowLeft}>Previous</FormButton>
                        </FormGroup>
                    </Row>
                </Col>

                <Col xs={12} className={`d-${page === 4 ? 'block' : 'none'} d-sm-block`}>
                    <Row>
                        <FormInput type="password" className="col-md-6" icon={faLock} onChange={this.inputChangeHandler} value={password} name="password" required placeholder="Password" />
                        <FormInput type="password" className="col-md-6" icon={faLock} onChange={this.inputChangeHandler} value={password_confirmation} name="password_confirmation" required placeholder="Repeat Password" />
                        <FormGroup className="ml-2 mt-md-4 col-12 text-light text-left">
                            <Label check>
                                <CustomInput type="checkbox" id="terms" onChange={this.inputChangeHandler} value={terms} name="terms" label="Accept terms and conditions" inline />
                            </Label>
                        </FormGroup>

                        <FormGroup className="mt-5 col-md-6 mb-0 pb-0">
                            <FormButton color="yellow" icon={faSignInAlt}>Sign Up</FormButton>
                        </FormGroup>
                        <FormGroup className="d-sm-none col-md-6">
                            <FormButton type="button" onClick={() => this.goToPage(3)} color="lightblue" before icon={faArrowLeft}>Previous</FormButton>
                        </FormGroup>
                    </Row>
                </Col>
            </Form>;
        }

        return (
            <Layout signUp>
                {redirect}
                {errors}
                {content}
            </Layout>
        )
    }
}

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/plans')),
    onAuth: data => dispatch(actions.authSignup(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
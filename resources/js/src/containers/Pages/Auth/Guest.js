import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Form, FormGroup, Label, CustomInput } from 'reactstrap';
import { faUser, faSignInAlt, faLock } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

import FormInput from '../../../components/UI/FormInput/FormInput';
import FormButton from '../../../components/UI/FormButton/FormButton';
import CustomSpinner from '../../../components/UI/CustomSpinner/CustomSpinner';
import Error from '../../../components/Error/Error';
import Layout from './Layout';

import * as actions from '../../../store/actions/index';

export class Guest extends Component {
    state = {
        name: '',
        email: '',
        country: 'cm',
        code: '237',
        phone: '',
        password: '',
        password_confirmation: '',
        terms: false,

        countries: []
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
        console.log(this.state);
        this.props.onAuth(e.target);
    }

    inputChangeHandler = e => {
        const { name, value, checked } = e.target;
        if (name === 'country') return this.setState({ country: value, code: this.state.countries.find(({ country }) => country === value).code });
        if (name === 'terms') return this.setState({ terms: checked });
        this.setState({ [name]: value });
    }

    render() {
        const { loading, error } = this.props;
        const { countries, name, email, code, country, password, password_confirmation, phone, terms } = this.state;

        let errors;
        if (error) errors = <Error err={error} />;

        let content;
        if (countries.length === 0 || loading) content = <CustomSpinner />;
        else {
            const countriesOptions = countries.map(({ country, code, name }) => <option key={country} value={country} code={code}>{name}</option>);

            content = <Form onSubmit={this.submitHandler} className="row">
                <FormInput type="text" className="col-6" icon={faUser} onChange={this.inputChangeHandler} value={name} name="name" required placeholder="Full name" />
                <FormInput type="email" className="col-6" icon={faEnvelope} onChange={this.inputChangeHandler} value={email} name="email" required placeholder="Email" />
                <FormInput type="select" className="col-6" addon={<span className="text-white text-small d-inline-flex">
                    <div className="border border-1 border-white rounded-circle overflow-hidden position-relative d-flex justify-content-center align-items-center mr-2" style={{ width: 20, height: 20 }}>
                        <span className={`flag-icon text-large position-absolute flag-icon-${country.toLowerCase()}`} />
                    </div>

                    {country.toUpperCase()}
                </span>} onChange={this.inputChangeHandler} value={country || ''} name="country" required placeholder="Select your country">
                    <option>Select your country</option>
                    {countriesOptions}
                </FormInput>
                <input type="hidden" value={code} name="code" />
                <FormInput type="tel" className="col-6" addon={<span className="text-white text-small">+{code}</span>} onChange={this.inputChangeHandler} value={phone} name="phone" required placeholder="Phone" />
                <FormInput type="password" className="col-6" icon={faLock} onChange={this.inputChangeHandler} value={password} name="password" required placeholder="Pin code" />
                <FormInput type="password" className="col-6" icon={faLock} onChange={this.inputChangeHandler} value={password_confirmation} name="password_confirmation" required placeholder="Confirm pin code" />
                <FormGroup className="ml-2 mb-5 mt-4 col-12 text-light text-left">
                    <Label check>
                        <CustomInput type="checkbox" id="terms" onChange={this.inputChangeHandler} checked={terms} name="terms" label="Accept terms and conditions" inline />
                    </Label>
                </FormGroup>
                <FormGroup className="col-6">
                    <FormButton color="yellow" icon={faSignInAlt}>Continue</FormButton>
                </FormGroup>
            </Form>;
        }


        return (
            <Layout guest>
                {errors}
                {content}
            </Layout>
        )
    }
}

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    onAuth: data => dispatch(actions.authGuest(data))
});


export default connect(mapStateToProps, mapDispatchToProps)(Guest);
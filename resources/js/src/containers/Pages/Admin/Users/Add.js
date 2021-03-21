import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Col, Row, FormGroup } from 'reactstrap';
import { faUserTie, faUser, faMoneyBillWave, faPlusCircle, faUsers, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';

// Components
import BackEnd from '../../../BackEnd';

import Breadcrumb from '../../../../components/Backend/UI/Breadcrumb/Breadcrumb';
import SpecialTitle from '../../../../components/UI/Titles/SpecialTitle/SpecialTitle';
import Subtitle from '../../../../components/UI/Titles/Subtitle/Subtitle';
import Error from '../../../../components/Error/Error';
import CustomSpinner from '../../../../components/UI/CustomSpinner/CustomSpinner';
import Form from '../../../../components/Backend/UI/Form/Form';
import FormInput from '../../../../components/UI/FormInput/FormInput';
import FormButton from '../../../../components/UI/FormButton/FormButton';
import Feedback from '../../../../components/Feedback/Feedback';

import * as actions from '../../../../store/actions';

class Add extends Component {
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

        countries: []
    }

    async componentDidMount() {
        const { onResetUsers } = this.props;
        onResetUsers();

        const phoneRes = await fetch(CORS + 'http://country.io/phone.json', { method: 'GET', mode: 'cors' });
        const namesRes = await fetch(CORS + 'http://country.io/names.json', { method: 'GET', mode: 'cors' });

        const phone = await phoneRes.json();
        const names = await namesRes.json();

        const countries = Object.keys(phone).map(key => ({ country: key, code: phone[key], name: names[key] })).sort((a, b) => a.country > b.country);

        this.setState({ countries });
    }

    componentWillUnmount() {
        const { onResetUsers } = this.props;
        onResetUsers();
    }

    submitHandler = async e => {
        e.preventDefault();
        await this.props.onPostAdminAddUser(e.target);
    }

    inputChangeHandler = e => {
        const { name, value, checked } = e.target;
        if (name === 'country') return this.setState({ country: value, code: this.state.countries.find(({ country }) => country === value).code });
        if (name === 'terms') return this.setState({ terms: checked });
        this.setState({ [name]: value });
    }

    render() {
        let { backend: { users: { loading, error, message } } } = this.props;
        const { code, countries, country, email, first_name, last_name, password, password_confirmation, phone, username } = this.state;
        let content = null;
        let errors = null;

        if (loading) content = <Col xs={12}>
            <CustomSpinner />
        </Col>;
        else {
            errors = <>
                <Error err={error} />
            </>;
            const countriesOptions = countries.map(({ country, code, name }) => <option key={country} value={country} code={code}>{name}</option>);
            content = (
                <>
                    <Row>
                        <Form onSubmit={this.submitHandler} icon={faUsers} title="Add User" link="/admin/users" innerClassName="row" className="bg-darklight shadow-sm">
                            <Col lg={8}>
                                <Feedback message={message} />
                                <Row>
                                    <FormInput type="text" className="col-md-6" icon={faUser} onChange={this.inputChangeHandler} value={first_name} name="first_name" required placeholder="First name" />
                                    <FormInput type="text" className="col-md-6" icon={faUser} onChange={this.inputChangeHandler} value={last_name} name="last_name" required placeholder="Last name" />
                                    <FormInput type="text" className="col-md-6" icon={faUser} onChange={this.inputChangeHandler} value={username} name="username" required placeholder="Username" />
                                    <FormInput type="email" className="col-md-6" icon={faEnvelope} onChange={this.inputChangeHandler} value={email} name="email" required placeholder="Email" />
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
                                    <FormInput type="password" className="col-md-6" icon={faLock} onChange={this.inputChangeHandler} value={password} name="password" required placeholder="Password" />
                                    <FormInput type="password" className="col-md-6" icon={faLock} onChange={this.inputChangeHandler} value={password_confirmation} name="password_confirmation" required placeholder="Repeat Password" />

                                    <div className="col-md-6">
                                        <FormButton color="green" icon={faPlusCircle}>Add User</FormButton>
                                    </div>
                                </Row>
                            </Col>
                        </Form>
                    </Row>
                </>
            );
        }

        return (
            <>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main="Add User" icon={faUsers} />
                    <SpecialTitle user icon={faUsers}>Admin panel</SpecialTitle>
                    <Subtitle user>Add User</Subtitle>
                </div>
                <div className="p-4 pb-0">
                    {errors}
                    {content}
                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onPostAdminAddUser: data => dispatch(actions.postAdminAddUser(data)),
    onResetUsers: () => dispatch(actions.resetUsers()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Add));
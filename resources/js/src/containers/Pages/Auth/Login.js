import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Form, FormGroup } from 'reactstrap';
import { faUser, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

import Layout from './Layout';

import FormInput from '../../../components/UI/FormInput/FormInput';
import FormButton from '../../../components/UI/FormButton/FormButton';

import * as actions from '../../../store/actions/index';

export class Home extends Component {
    state = {
        email: '',
        phone: ''
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
            <Layout getIn>
                <Form onSubmit={this.submitHandler} className="w-50">
                    <FormInput type="text" icon={faUser} onChange={(e) => this.inputChangeHandler(e, "email")} value={this.state.email} name="email" required placeholder="Email, username, Limo ID or code" />
                    <FormInput type="password" icon={faLock} onChange={(e) => this.inputChangeHandler(e, "phone")} value={this.state.phone} name="phone" required placeholder="Password" />
                    <FormGroup className="ml-2 mb-5 mt-4">
                        <p className="text-light text-right">Forgot password ? <strong className="text-yellow">Reset here</strong></p>
                    </FormGroup>
                    <FormButton color="yellow" icon={faSignInAlt}>Sign In</FormButton>
                </Form>
            </Layout>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onAuth: data => dispatch(actions.authGuestSignup(data)),
});

export default connect(null, mapDispatchToProps)(Home);
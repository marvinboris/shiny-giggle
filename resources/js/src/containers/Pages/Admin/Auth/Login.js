import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Form, FormGroup, Label, CustomInput } from 'reactstrap';
import { faLock, faSignInAlt, faUser } from '@fortawesome/free-solid-svg-icons';

import Layout from './Layout';

import FormInput from '../../../../components/UI/FormInput/FormInput';
import FormButton from '../../../../components/UI/FormButton/FormButton';
import Error from '../../../../components/Error/Error';
import Feedback from '../../../../components/Feedback/Feedback';
import CustomSpinner from '../../../../components/UI/CustomSpinner/CustomSpinner';

import * as actions from '../../../../store/actions/index';

export class Login extends Component {
    state = {
        email: '',
        password: '',
        otp: 'email'
    }

    componentDidUpdate() {
        const { auth: { hash }, onSetHash, history } = this.props;
        if (hash) {
            onSetHash(hash);
            history.push('/auth/admin/verify');
        }
    }

    submitHandler = e => {
        e.preventDefault();
        this.props.onAuth(e.target);
    }

    inputChangeHandler = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    render() {
        const { auth: { loading, error, message } } = this.props;
        const errors = <Error err={error} />;
        const feedback = <Feedback message={message} />;
        let content = null;

        if (loading) content = <div className="h-100 d-flex justify-content-center align-items-center"><CustomSpinner /></div>;
        else content = <>
            <div className="h4 mb-4 text-white text-sm-left">Sign In to <span className="text-yellow">Admin panel</span></div>
            {errors}
            {feedback}
            <Form onSubmit={this.submitHandler}>
                <FormInput type="text" icon={faUser} onChange={this.inputChangeHandler} value={this.state.email} name="email" required placeholder="E-mail address" />
                <FormInput type="password" icon={faLock} onChange={this.inputChangeHandler} value={this.state.password} name="password" required placeholder="Password" />

                <FormGroup className="ml-2 mt-4 mb-5 d-flex align-items-center text-light">
                    <div className='text-700 pr-4'>OTP Method</div>
                    <Label check>
                        <CustomInput type="radio" id="sms" name="otp" value="sms" label="SMS" inline />
                    </Label>
                    <Label check>
                        <CustomInput type="radio" id="email" defaultChecked name="otp" value="email" label="Email" inline />
                    </Label>
                </FormGroup>

                <FormButton color="yellow" icon={faSignInAlt}>Sign In</FormButton>
            </Form>
        </>;

        return (
            <Layout>
                {content}
            </Layout>
        )
    }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onAuth: data => dispatch(actions.authAdmin(data)),
    onSetHash: hash => dispatch(actions.setHash(hash))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
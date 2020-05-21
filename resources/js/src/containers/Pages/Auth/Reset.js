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
        password: '',
        password_confirmation: '',
    }

    submitHandler = e => {
        const { id, code } = this.props.match.params;
        e.preventDefault();
        this.props.onAuth(id, code, e.target);
    }

    inputChangeHandler = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    render() {
        const { message, loading, error } = this.props;
        const { password, password_confirmation } = this.state;

        let errors;
        if (error) errors = <Error err={error} />;

        let redirect = null;
        if (message && message.type === 'success') redirect = <Redirect to="/auth/login" />;

        let content;
        if (loading) content = <CustomSpinner />;
        else {
            content = <Form onSubmit={this.submitHandler} className="row">
                <Col lg={6}>
                    <FormInput type="password" icon={faLock} onChange={this.inputChangeHandler} value={password} name="password" required placeholder="Password" />
                    <FormInput type="password" icon={faLock} onChange={this.inputChangeHandler} value={password_confirmation} name="password_confirmation" required placeholder="Repeat Password" />

                    <FormGroup className="mt-5">
                        <FormButton color="yellow" icon={faSignInAlt}>Reset</FormButton>
                    </FormGroup>
                </Col>
            </Form>;
        }

        return (
            <Layout>
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
    onAuth: (id, code, data) => dispatch(actions.resetPassword(id, code, data))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
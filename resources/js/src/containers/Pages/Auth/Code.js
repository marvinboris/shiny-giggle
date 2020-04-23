import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Form } from 'reactstrap';
import { faLock, faSignInAlt, faCode } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import Layout from './Layout';

import FormInput from '../../../components/UI/FormInput/FormInput';
import FormButton from '../../../components/UI/FormButton/FormButton';

import * as actions from '../../../store/actions/index';

export class Home extends Component {
    state = {
        code: '',
        password: ''
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
            <Layout code>
                <Form onSubmit={this.submitHandler} className="w-50">
                    <FormInput type="text" icon={faCode} onChange={(e) => this.inputChangeHandler(e, "code")} value={this.state.code} name="code" required placeholder="Plan code" />
                    <FormInput className="mb-5" type="password" icon={faLock} onChange={(e) => this.inputChangeHandler(e, "password")} value={this.state.password} name="password" required placeholder="Pin code" />
                    <FormButton color="yellow" icon={faSignInAlt}>Continue</FormButton>
                    <p className="text-center"><Link to="/auth/login" className="text-yellow">I have no code</Link></p>
                </Form>
            </Layout>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onAuth: data => dispatch(actions.authCode(data)),
});

export default connect(null, mapDispatchToProps)(Home);
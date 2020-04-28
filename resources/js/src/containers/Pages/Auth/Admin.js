import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Form } from 'reactstrap';
import { faLock, faSignInAlt, faCode, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import Layout from './Layout';

import FormInput from '../../../components/UI/FormInput/FormInput';
import FormButton from '../../../components/UI/FormButton/FormButton';

import * as actions from '../../../store/actions/index';

export class Home extends Component {
    state = {
        email: '',
        password: ''
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

    inputChangeHandler = (e, name) => {
        this.setState({ [name]: e.target.value });
    }

    render() {
        return (
            <Layout admin>
                <Form onSubmit={this.submitHandler} className="w-50">
                    <FormInput type="text" icon={faUser} onChange={(e) => this.inputChangeHandler(e, "email")} value={this.state.email} name="email" required placeholder="E-mail address" />
                    <FormInput className="mb-5" type="password" icon={faLock} onChange={(e) => this.inputChangeHandler(e, "password")} value={this.state.password} name="password" required placeholder="Password" />
                    <FormButton color="yellow" icon={faSignInAlt}>Continue</FormButton>
                    <p className="text-center"><Link to="/auth/login" className="text-yellow">I am a user</Link></p>
                </Form>
            </Layout>
        )
    }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onAuth: data => dispatch(actions.authAdmin(data)),
    onSetHash: hash => dispatch(actions.setHash(hash))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
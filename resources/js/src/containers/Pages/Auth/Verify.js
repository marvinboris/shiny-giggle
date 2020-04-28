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
        code: '',
    }

    componentWillUnmount() {
        const { onSetHash } = this.props;
        onSetHash(null);
    }

    submitHandler = e => {
        e.preventDefault();
        this.props.onAuth(e.target);
    }

    inputChangeHandler = (e, name) => {
        this.setState({ [name]: e.target.value });
    }

    render() {
        const { auth: { hash }, history } = this.props;
        if (!hash) history.push('/admin');
        return (
            <Layout verify>
                <Form onSubmit={this.submitHandler} className="w-50">
                    <FormInput className="mb-5" type="text" icon={faCode} onChange={(e) => this.inputChangeHandler(e, "code")} value={this.state.code} name="code" required placeholder="Verification code" />
                    <input type="hidden" name="hash" value={hash} />
                    <FormButton color="yellow" icon={faSignInAlt}>Continue</FormButton>
                    <p className="text-center"><Link to="/auth/login" className="text-yellow">I am a user</Link></p>
                </Form>
            </Layout>
        )
    }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onAuth: data => dispatch(actions.authVerify(data)),
    onSetHash: hash => dispatch(actions.setHash(hash))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
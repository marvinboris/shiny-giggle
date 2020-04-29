import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Form } from 'reactstrap';
import { faSignInAlt, faCode } from '@fortawesome/free-solid-svg-icons';

import Layout from './Layout';

import FormInput from '../../../../components/UI/FormInput/FormInput';
import FormButton from '../../../../components/UI/FormButton/FormButton';
import Error from '../../../../components/Error/Error';
import Feedback from '../../../../components/Feedback/Feedback';
import CustomSpinner from '../../../../components/UI/CustomSpinner/CustomSpinner';

import * as actions from '../../../../store/actions/index';

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
        const { auth: { hash, loading, error, message }, history } = this.props;
        if (!hash) history.push('/admin');

        const errors = <Error err={error} />;
        const feedback = <Feedback message={message} />;
        let content = null;

        if (loading) content = <div className="h-100 d-flex justify-content-center align-items-center"><CustomSpinner /></div>;
        else content = <>
            <div className="h4 mb-4 text-white text-sm-left">Enter <span className="text-yellow">Verification code</span></div>
            {errors}
            {feedback}
            <Form onSubmit={this.submitHandler}>
                <FormInput className="mb-5" type="text" icon={faCode} onChange={(e) => this.inputChangeHandler(e, "code")} value={this.state.code} name="code" required placeholder="Verification code" />
                <input type="hidden" name="hash" value={hash} />

                <FormButton color="yellow" icon={faSignInAlt}>Continue</FormButton>
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
    onAuth: data => dispatch(actions.authVerify(data)),
    onSetHash: hash => dispatch(actions.setHash(hash))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
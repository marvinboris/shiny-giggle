import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col } from 'reactstrap';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { Redirect } from 'react-router-dom';

import FrontEnd from '../../FrontEnd';

import Title from '../../../components/UI/Title/Title';
import FormButton from '../../../components/UI/FormButton/FormButton';

import { clearSignup } from '../../../store/actions';

class Success extends Component {
    componentWillUnmount() {
        this.props.onClearSignup();
    }

    clickHandler = () => {
        this.props.history.push('/auth/login');
    }

    render() {
        const { status, email } = this.props;

        let redirect = null;
        if (!status) redirect = <Redirect to="/auth/login" />;

        return <Col lg={7} className="mx-auto flex-fill d-flex flex-column justify-content-center align-items-center">
            {redirect}
            <Title check style={{ width: '85%' }}>
                Your account was created
                and activated
                successfully.
                You will receive a notification by mail to
                    {/* Please check your email  */}
                <span className="text-yellow">{email}</span>
                    . You may proceed to login.
                    {/* to verify. */}
            </Title>

            <Col xs={5} className="pt-5"><FormButton onClick={this.clickHandler} icon={faAngleDoubleRight} color="yellow">Login now</FormButton></Col>
        </Col>;
    }
}

const mapStateToProps = state => ({ ...state.auth.signup });

const mapDispatchToProps = dispatch => ({
    onClearSignup: () => dispatch(clearSignup())
});

export default connect(mapStateToProps, mapDispatchToProps)(Success);
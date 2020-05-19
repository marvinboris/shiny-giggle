import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { faUserTie, faUser, faMoneyBillWave, faPlusCircle, faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

// Components
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
        title: '',
        subject: '',
        message: '',
        file: null,
    }

    componentDidMount() {
        const { onResetContactUs } = this.props;
        onResetContactUs();
    }

    componentWillUnmount() {
        const { onResetContactUs } = this.props;
        onResetContactUs();
    }

    submitHandler = async e => {
        e.preventDefault();
        await this.props.onPostUserContactUs(e.target);
    }

    fileButtonClickedHandler = () => {
        document.getElementById('file').click();
    }

    inputChangeHandler = e => {
        const { value, files, name } = e.target;
        this.setState({ [name]: files ? files[0] : value });
    }

    render() {
        let { backend: { contactUs: { loading, error, message } } } = this.props;
        let content = null;
        let errors = null;

        if (loading) content = <Col xs={12}>
            <CustomSpinner />
        </Col>;
        else {
            errors = <>
                <Error err={error} />
            </>;
            content = (
                <>
                    <Row>
                        <Form onSubmit={this.submitHandler} icon={faEnvelope} title="Contact Us" list="Contact Us List" link="/user/contact-us" innerClassName="row align-items-center" className="bg-darklight shadow-sm">
                            <Col xl={6} className="border-right border-border pr-lg-5">
                                <Feedback message={message} />
                                <Row>
                                    <Col md={6}>
                                        <FormInput type="text" icon={faUser} onChange={this.inputChangeHandler} value={this.state.title} name="title" required placeholder="Title" />
                                    </Col>

                                    <Col md={6}>
                                        <FormInput type="text" icon={faUser} onChange={this.inputChangeHandler} value={this.state.subject} name="subject" required placeholder="Subject" />
                                    </Col>

                                    <Col xs={12}>
                                        <FormInput type="textarea" icon={faMoneyBillWave} onChange={this.inputChangeHandler} value={this.state.message} name="message" required placeholder="Type your message here" />
                                    </Col>

                                    <Col lg={4}>
                                        <FormButton type="button" color="secondary" before onClick={this.fileButtonClickedHandler} icon={faPaperclip}>Attach a file</FormButton>
                                        <input id="file" type="file" className="d-none" name="file" />
                                    </Col>

                                    <Col lg={8} className="text-light d-flex align-items-center">
                                        <p>Only PDF, JPG, JPEG, PNG files are allowed</p>
                                    </Col>

                                    <Col md={6} className="mt-5">
                                        <FormButton color="green" icon={faPaperPlane}>Send</FormButton>
                                    </Col>
                                    <Col md={6} className="mt-md-5">
                                        <FormButton color="orange">Cancel</FormButton>
                                    </Col>
                                </Row>
                            </Col>

                            <Col xl={6} className="text-center text-light text-x-large py-5 py-lg-0">
                                <div><span className="text-700">E-Mail</span>: support@limocalc.com</div>
                                <div><span className="text-700">Phone No</span>: 237655287531</div>
                            </Col>
                        </Form>
                    </Row>
                </>
            );
        }

        return (
            <>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main="Contact Us" icon={faEnvelope} />
                    <SpecialTitle user icon={faEnvelope}>User panel</SpecialTitle>
                    <Subtitle user>Contact Us</Subtitle>
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
    onPostUserContactUs: data => dispatch(actions.postUserContactUs(data)),
    onResetContactUs: () => dispatch(actions.resetContactUs()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Add));
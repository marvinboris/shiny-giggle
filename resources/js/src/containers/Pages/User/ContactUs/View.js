import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faUser, faMoneyBillWave, faPlusCircle, faPaperPlane, faPaperclip, faReply, faFile } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

// Components
import Download from '../../../../components/Backend/UI/Download/Download';
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
import { updateObject } from '../../../../shared/utility';

class View extends Component {
    state = {
        title: '',
        subject: '',
        message: '',
        file: null,
        feedback: '',
        admin_file: null,
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.backend.contactUs.contact && prevState.title === '') {
            const { backend: { contactUs: { contact } } } = nextProps;
            return updateObject(prevState, { ...contact });
        }
        return prevState;
    }

    componentDidMount() {
        const { onResetContactUs, onGetUserContactUs, match: { params: { id } } } = this.props;
        onResetContactUs();
        onGetUserContactUs(id);
    }

    componentWillUnmount() {
        const { onResetContactUs } = this.props;
        onResetContactUs();
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
                        <Form onSubmit={e => e.preventDefault()} icon={faEnvelope} title="Contact Us" list="Contact Us List" link="/user/contact-us" innerClassName="row align-items-center" className="bg-darklight shadow-sm">
                            <Col xl={6} className="border-right border-border pr-lg-5">
                                <Feedback message={message} />
                                <Row>
                                    <Col md={6}>
                                        <FormInput type="text" icon={faUser} value={this.state.title} name="title" readonly placeholder="Title" />
                                    </Col>

                                    <Col md={6}>
                                        <FormInput type="text" icon={faUser} value={this.state.subject} name="subject" readonly placeholder="Subject" />
                                    </Col>

                                    <Col xs={12}>
                                        <FormInput type="textarea" icon={faMoneyBillWave} value={this.state.message} name="message" readonly placeholder="Type your message here" />
                                    </Col>

                                    <Col lg={4}>
                                        {this.state.file ? <div className="d-inline-block mb-3">
                                            <Download name={this.state.file.split('/')[this.state.file.split('/').length - 1]} link={this.state.file}>
                                                <div className="rounded-2 p-2 bg-light text-darkblue text-uppercase text-nowrap"><FontAwesomeIcon icon={faFile} className="mr-2" />{this.state.file.split('/')[this.state.file.split('/').length - 1]}</div>
                                            </Download>
                                        </div> : null}
                                    </Col>

                                    <Col xs={12}>
                                        <FormInput type="textarea" icon={faReply} value={this.state.feedback} name="feedback" readonly />
                                    </Col>

                                    <Col lg={4}>
                                        {this.state.admin_file ? <div className="d-inline-block mb-3">
                                            <Download name={this.state.admin_file.split('/')[this.state.admin_file.split('/').length - 1]} link={this.state.admin_file}>
                                                <div className="rounded-2 p-2 bg-light text-darkblue text-uppercase text-nowrap"><FontAwesomeIcon icon={faFile} className="mr-2" />{this.state.admin_file.split('/')[this.state.admin_file.split('/').length - 1]}</div>
                                            </Download>
                                        </div> : null}
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
    onGetUserContactUs: id => dispatch(actions.getUserContactUs(id)),
    onResetContactUs: () => dispatch(actions.resetContactUs()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(View));
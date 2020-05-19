import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { faUserTie, faUser, faMoneyBillWave, faPlusCircle, faPaperPlane, faPaperclip, faReply, faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import Download from '../../../../components/Backend/UI/Download/Download';

import * as actions from '../../../../store/actions';
import { updateObject } from '../../../../shared/utility';

class Edit extends Component {
    state = {
        title: '',
        subject: '',
        message: '',
        feedback: '',
        file: null
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.backend.contactUs.contact && prevState.title === '') {
            const { backend: { contactUs: { contact } } } = nextProps;
            return updateObject(prevState, { ...contact });
        }
        return prevState;
    }

    componentDidMount() {
        const { onResetContactUs, onGetAdminContactUs, match: { params: { id } } } = this.props;
        onResetContactUs();
        onGetAdminContactUs(id);
    }

    componentWillUnmount() {
        const { onResetContactUs } = this.props;
        onResetContactUs();
    }

    submitHandler = async e => {
        e.preventDefault();
        await this.props.onPostAdminEditContactUs(this.props.match.params.id, e.target);
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
                        <Form onSubmit={this.submitHandler} icon={faEnvelope} title="Reply Contact Us" list="Contact Us List" link="/admin/contact-us" innerClassName="row align-items-center" className="bg-darklight shadow-sm">
                            <Col xl={6}>
                                <Feedback message={message} />
                                <Row>
                                    <Col md={6}>
                                        <FormInput type="text" icon={faUser} onChange={this.inputChangeHandler} value={this.state.title} name="title" required readonly placeholder="Title" />
                                    </Col>

                                    <Col md={6}>
                                        <FormInput type="text" icon={faUser} onChange={this.inputChangeHandler} value={this.state.subject} name="subject" required readonly placeholder="Subject" />
                                    </Col>

                                    <Col xs={12}>
                                        <FormInput type="textarea" icon={faMoneyBillWave} value={this.state.message} name="message" required readonly placeholder="Type your message here" />
                                    </Col>

                                    <Col xs={12}>
                                        {this.state.file ? <div className="d-inline-block mb-3">
                                            <Download name={this.state.file.split('/')[this.state.file.split('/').length - 1]} link={this.state.file}>
                                                <div className="rounded-2 p-2 bg-light text-darkblue text-uppercase text-nowrap"><FontAwesomeIcon icon={faFile} className="mr-2" />{this.state.file.split('/')[this.state.file.split('/').length - 1]}</div>
                                            </Download>
                                        </div> : null}
                                    </Col>

                                    <Col xs={12}>
                                        <FormInput type="textarea" icon={faReply} onChange={this.inputChangeHandler} value={this.state.feedback} name="feedback" required placeholder="Type your feedback here" />
                                    </Col>

                                    <Col lg={4}>
                                        <FormButton type="button" color="secondary" before onClick={this.fileButtonClickedHandler} icon={faPaperclip}>Attach a file</FormButton>
                                        <input id="file" type="file" className="d-none" name="admin_file" />
                                    </Col>

                                    <Col lg={8} />

                                    <Col md={6} className="mt-5">
                                        <FormButton color="green" icon={faReply}>Reply</FormButton>
                                    </Col>
                                </Row>
                            </Col>
                        </Form>
                    </Row>
                </>
            );
        }

        return (
            <>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main="Reply Contact Us" icon={faEnvelope} />
                    <SpecialTitle user icon={faEnvelope}>User panel</SpecialTitle>
                    <Subtitle user>Reply Contact Us</Subtitle>
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
    onPostAdminEditContactUs: (id, data) => dispatch(actions.postAdminEditContactUs(id, data)),
    onGetAdminContactUs: id => dispatch(actions.getAdminContactUs(id)),
    onResetContactUs: () => dispatch(actions.resetContactUs()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Edit));
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Col, Row, FormGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faWallet, faDollarSign, faAngleDoubleRight, faCalendar, faUser, faPhone, faEnvelope, faSignInAlt, faArrowLeft, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

// Components
import BackEnd from '../../../BackEnd';

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

class Edit extends Component {
    state = {
        feedback: '',
        status: 0,

        page: 1,
    }

    componentDidMount() {
        const { onGetAdminLimoPayment, match: { params: { id } } } = this.props;
        onGetAdminLimoPayment(id);
    }

    componentWillUnmount() {
        this.props.onResetAdminFinances();
    }

    submitHandler = e => {
        e.preventDefault();
        e.persist();
        this.setState({ status: 2 }, () => {
            const { onPostAdminLimoPayment, match: { params: { id } } } = this.props;
            onPostAdminLimoPayment(id, e.target);
        });
    }

    cancelHandler = () => {
        const form = document.getElementById('form');
        this.setState({ status: 1 }, () => {
            const { onPostAdminLimoPayment, match: { params: { id } } } = this.props;
            onPostAdminLimoPayment(id, form);
        });
    }

    inputChangeHandler = e => {
        const { name, value, checked } = e.target;
        this.setState({ [name]: value });
    }

    goToPage = page => {
        this.setState({ page });
    }

    render() {
        let { backend: { finances: { loading, error, limoPayment, message } } } = this.props;
        const { page, status } = this.state;
        let content = null;
        let errors = null;

        if (loading) content = <Col xs={12}>
            <CustomSpinner />
        </Col>;
        else {
            errors = <>
                <Error err={error} />
            </>;
            if (limoPayment) {
                const { transfer_no, date, name, email, phone, limo_id, amount } = limoPayment;
                content = (
                    <Row>
                        <Form id="form" onSubmit={this.submitHandler} icon={faUserTie} title="Edit Limo Payment" list="Limo Payments" link="/admin/finances/limo-payments" innerClassName="row" className="bg-darklight shadow-sm">
                            <Col xl={8}>
                                <Feedback message={message} />
                                <Row>
                                    <Col xs={12} className={`d-${page === 1 ? 'block' : 'none'} d-sm-block`}>
                                        <Row>
                                            <FormInput className="col-md-6" type="text" icon={faUser} value="LIMCAL" required readonly />
                                            <FormInput className="col-md-6" type="text" icon={faWallet} name="transfer_no" value={transfer_no} onChange={this.inputChangeHandler} placeholder="Transfer No" required />

                                            <FormGroup className="d-sm-none col-md-6 mb-0 pb-0">
                                                <FormButton type="button" onClick={() => this.goToPage(2)} color="yellow" icon={faSignInAlt}>Next</FormButton>
                                            </FormGroup>
                                        </Row>
                                    </Col>

                                    <Col xs={12} className={`d-${page === 2 ? 'block' : 'none'} d-sm-block`}>
                                        <Row>
                                            <FormInput className="col-md-6" type="date" icon={faCalendar} name="date" value={date} onChange={this.inputChangeHandler} placeholder="Date" required />
                                            <FormInput className="col-md-6" type="text" icon={faUser} name="name" value={name} onChange={this.inputChangeHandler} placeholder="Full Name" required />

                                            <FormGroup className="d-sm-none col-md-6 mb-0 pb-0">
                                                <FormButton type="button" onClick={() => this.goToPage(3)} color="yellow" icon={faSignInAlt}>Next</FormButton>
                                            </FormGroup>
                                            <FormGroup className="d-sm-none col-md-6">
                                                <FormButton type="button" onClick={() => this.goToPage(1)} color="lightblue" before icon={faArrowLeft}>Previous</FormButton>
                                            </FormGroup>
                                        </Row>
                                    </Col>

                                    <Col xs={12} className={`d-${page === 3 ? 'block' : 'none'} d-sm-block`}>
                                        <Row>
                                            <FormInput className="col-md-6" type="email" icon={faEnvelope} name="email" value={email} onChange={this.inputChangeHandler} placeholder="E-Mail Address" required />
                                            <FormInput className="col-md-6" type="tel" icon={faPhone} name="phone" value={phone} onChange={this.inputChangeHandler} placeholder="Phone Number" required />

                                            <FormGroup className="d-sm-none col-md-6 mb-0 pb-0">
                                                <FormButton type="button" onClick={() => this.goToPage(4)} color="yellow" icon={faSignInAlt}>Next</FormButton>
                                            </FormGroup>
                                            <FormGroup className="d-sm-none col-md-6">
                                                <FormButton type="button" onClick={() => this.goToPage(2)} color="lightblue" before icon={faArrowLeft}>Previous</FormButton>
                                            </FormGroup>
                                        </Row>
                                    </Col>

                                    <Col xs={12} className={`d-${page === 4 ? 'block' : 'none'} d-sm-block`}>
                                        <Row>
                                            <FormInput className="col-md-6" type="text" icon={faUser} name="limo_id" value={limo_id} onChange={this.inputChangeHandler} placeholder="Liyeplimal User ID" required />
                                            <FormInput className="col-md-6" type="text" icon={faDollarSign} value={`$${amount} Dollar`} append="Limo" required readonly />
                                            <input type="hidden" name="amount" value={amount} />
                                            <input type="hidden" name="status" value={status} />

                                            <FormGroup className="col-md-6 mb-0 pb-0">
                                                <FormButton color="green" icon={faCheck}>Confirm</FormButton>
                                            </FormGroup>
                                            <FormGroup className="col-md-6 mb-0 pb-0">
                                                <FormButton color="red" type="button" onClick={this.cancelHandler} icon={faTimes}>Cancel</FormButton>
                                            </FormGroup>
                                            <FormGroup className="d-sm-none col-md-6">
                                                <FormButton type="button" onClick={() => this.goToPage(3)} color="lightblue" before icon={faArrowLeft}>Previous</FormButton>
                                            </FormGroup>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Form>
                    </Row>
                );
            }
        }

        return (
            <>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main="Edit Limo Payment" icon={faUserTie} />
                    <SpecialTitle user icon={faUserTie}>Admin panel</SpecialTitle>
                    <Subtitle user>Edit Limo Payment</Subtitle>
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
    onGetAdminLimoPayment: id => dispatch(actions.getAdminLimoPayment(id)),
    onPostAdminLimoPayment: (id, data) => dispatch(actions.postAdminLimoPayment(id, data)),
    onResetAdminFinances: () => dispatch(actions.resetAdminFinances()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Edit));
import React, { Component } from 'react'
import { faWallet, faDollarSign, faAngleDoubleRight, faCalendar, faUser, faPhone, faEnvelope, faSignInAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Form, Label, FormGroup, CustomInput, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';

import Layout from './Layout';
import Error from '../../../components/Error/Error';
import FormInput from '../../../components/UI/FormInput/FormInput';
import FormButton from '../../../components/UI/FormButton/FormButton';
import CustomSpinner from '../../../components/UI/CustomSpinner/CustomSpinner';

class Limo extends Component {
    state = {
        transfer_no: '',
        date: '',
        name: '',
        email: '',
        phone: '',
        limo_id: '',
        amount: '',

        page: 1,
    }

    componentDidMount() {
        this.props.onGetPaymentInfo(this.props.match.params.slug);
    }

    onSubmitHandler = e => {
        e.preventDefault();
        this.props.onPostLimoPayment(e.target);
    }

    inputChangeHandler = e => {
        const { name, value, checked } = e.target;
        this.setState({ [name]: value });
    }

    goToPage = page => {
        this.setState({ page });
    }

    render() {
        const { payment: { loading, error, plan, methods, message } } = this.props;
        const { transfer_no, date, name, email, phone, limo_id, page } = this.state;

        if (message) this.props.history.push(message);

        let content = null;

        if (loading) content = <CustomSpinner />;
        else {
            if (plan && methods) {
                content = <Form onSubmit={this.onSubmitHandler} className="row">
                    <Col xs={12} className="text-white pb-4 text-justify">
                        Transfer <span className="text-700 text-lightblue">${plan.price}</span> Limo to the <span className="text-700 text-orange">TTAGVP</span> Liyeplimal account and fill this form with that transfer's recipe information.
                    </Col>

                    <Col xs={12} className={`d-${page === 1 ? 'block' : 'none'} d-sm-block`}>
                        <Row>
                            <FormInput className="col-md-6" type="text" icon={faUser} value="TTAGVP" required readonly />
                            <FormInput className="col-md-6" type="text" icon={faWallet} name="transfer_no" value={transfer_no} onChange={this.inputChangeHandler} placeholder="Transfer No" required />

                            <FormGroup className="d-sm-none mt-5 col-md-6 mb-0 pb-0">
                                <FormButton type="button" onClick={() => this.goToPage(2)} color="yellow" icon={faSignInAlt}>Next</FormButton>
                            </FormGroup>
                        </Row>
                    </Col>

                    <Col xs={12} className={`d-${page === 2 ? 'block' : 'none'} d-sm-block`}>
                        <Row>
                            <FormInput className="col-md-6" type="date" icon={faCalendar} name="date" value={date} onChange={this.inputChangeHandler} placeholder="Date" required />
                            <FormInput className="col-md-6" type="text" icon={faUser} name="name" value={name} onChange={this.inputChangeHandler} placeholder="Full Name" required />

                            <FormGroup className="d-sm-none mt-5 col-md-6 mb-0 pb-0">
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

                            <FormGroup className="d-sm-none mt-5 col-md-6 mb-0 pb-0">
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
                            <FormInput className="col-md-6" type="text" icon={faDollarSign} value={`$${plan.price} Dollar`} append="Limo" required readonly />
                            <input type="hidden" name="amount" value={plan.price} />

                            <FormGroup className="mt-5 col-md-6 mb-0 pb-0">
                                <FormButton color="yellow" icon={faAngleDoubleRight}>Proceed</FormButton>
                            </FormGroup>
                            <FormGroup className="d-sm-none col-md-6">
                                <FormButton type="button" onClick={() => this.goToPage(3)} color="lightblue" before icon={faArrowLeft}>Previous</FormButton>
                            </FormGroup>
                        </Row>
                    </Col>
                </Form>;
            } else content = <div className="py-5">
                <Error err={error} />
            </div>;
        }

        return (
            <Layout limo loading={loading} link={`/plans/${this.props.match.params.slug}/payment`}>
                {content}
            </Layout>
        )
    }
}


const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onGetPaymentInfo: slug => dispatch(actions.getPaymentInfo(slug)),
    onPostLimoPayment: data => dispatch(actions.postLimoPayment(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Limo);
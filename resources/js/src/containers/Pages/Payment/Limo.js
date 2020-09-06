import React, { Component } from 'react'
import { faWallet, faDollarSign, faAngleDoubleRight, faCalendar, faUser, faPhone, faEnvelope, faSignInAlt, faArrowLeft, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import { Form, Label, FormGroup, CustomInput, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';

import Layout from './Layout';
import Error from '../../../components/Error/Error';
import FormInput from '../../../components/UI/FormInput/FormInput';
import FormButton from '../../../components/UI/FormButton/FormButton';
import CustomSpinner from '../../../components/UI/CustomSpinner/CustomSpinner';
import { Link } from 'react-router-dom';

class Limo extends Component {
    componentDidMount() {
        this.props.onGetPaymentInfo(this.props.match.params.slug);
    }

    onSubmitHandler = e => {
        e.preventDefault();
        window.location.href = this.props.payment.methods.find(({ slug }) => slug === 'limo').link;
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

        if (message) this.props.history.push(message);

        let content = null;

        if (loading) content = <CustomSpinner />;
        else {
            if (plan && methods) {
                content = <Form onSubmit={e => this.onSubmitHandler(e)} className="mr-auto">
                    <FormInput type="text" icon={faWallet} value="Limo Payment" required readonly />
                    <FormInput type="text" icon={faDollarSign} value={`$${plan.price} Dollar`} append="Limo" required readonly />

                    <FormGroup className="ml-2 mt-4 mb-5 text-light text-justify">
                        <span className="text-300 pr-1">Your total amount is </span>
                        <span className="text-700 text-yellow">{plan.price} Limo</span>
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col xs={6} className="pr-1"><Link to="/dashboard"><FormButton type="button" color="red" icon={faAngleDoubleLeft}>Cancel</FormButton></Link></Col>
                            <Col xs={6} className="pl-1"><FormButton color="yellow" icon={faAngleDoubleRight}>Proceed</FormButton></Col>
                        </Row>
                    </FormGroup>
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
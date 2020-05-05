import React, { Component } from 'react'
import { faWallet, faDollarSign, faAngleDoubleRight, faCalendar, faUser, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Form, Label, FormGroup, CustomInput, Col } from 'reactstrap';
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
    }

    componentDidMount() {
        this.props.onGetPaymentInfo(this.props.match.params.slug);
    }

    onSubmitHandler = e => {
        e.preventDefault();
        this.props.onPostLimoPayment(e.target);
    }

    inputChangeHandler = (e, name) => {
        this.setState({ [name]: e.target.value });
    }

    render() {
        const { payment: { loading, error, plan, methods, message } } = this.props;
        const { transfer_no, date, name, email, phone, limo_id } = this.state;

        if (message) this.props.history.push(message);

        let content = null;

        if (loading) content = <CustomSpinner />;
        else {
            if (plan && methods) {
                content = <Form onSubmit={e => this.onSubmitHandler(e)} className="row mr-auto">
                    <Col xs={12} className="text-white pb-4 text-sm-left">
                        Transfer <span className="text-700 text-lightblue">${plan.price}</span> Limo to the <span className="text-700 text-orange">LIMCAL</span> Liyeplimal account and fill this form with that transfer's recipe information.
                    </Col>

                    <FormInput className="col-6" type="text" icon={faUser} value="LIMCAL" required readonly />
                    <FormInput className="col-6" type="text" icon={faWallet} name="transfer_no" value={transfer_no} onChange={e => this.inputChangeHandler(e, 'transfer_no')} placeholder="Transfer No" required />
                    <FormInput className="col-6" type="date" icon={faCalendar} name="date" value={date} onChange={e => this.inputChangeHandler(e, 'date')} placeholder="Date" required />
                    <FormInput className="col-6" type="text" icon={faUser} name="name" value={name} onChange={e => this.inputChangeHandler(e, 'name')} placeholder="Full Name" required />
                    <FormInput className="col-6" type="email" icon={faEnvelope} name="email" value={email} onChange={e => this.inputChangeHandler(e, 'email')} placeholder="E-Mail Address" required />
                    <FormInput className="col-6" type="tel" icon={faPhone} name="phone" value={phone} onChange={e => this.inputChangeHandler(e, 'phone')} placeholder="Phone Number" required />
                    <FormInput className="col-6" type="text" icon={faUser} name="limo_id" value={limo_id} onChange={e => this.inputChangeHandler(e, 'limo_id')} placeholder="Liyeplimal User ID" required />
                    <FormInput className="col-6" type="text" icon={faDollarSign} value={`$${plan.price} Dollar`} append="Limo" required readonly />
                    <input type="hidden" name="amount" value={plan.price} />

                    <FormGroup className="col-6 mt-5">
                        <FormButton color="yellow" icon={faAngleDoubleRight}>Proceed</FormButton>
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
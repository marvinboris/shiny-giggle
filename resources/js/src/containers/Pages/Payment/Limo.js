import React, { Component } from 'react'
import { faWallet, faDollarSign, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { Form, Label, FormGroup, CustomInput } from 'reactstrap';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';

import Layout from './Layout';
import Error from '../../../components/Error/Error';
import FormInput from '../../../components/UI/FormInput/FormInput';
import FormButton from '../../../components/UI/FormButton/FormButton';
import CustomSpinner from '../../../components/UI/CustomSpinner/CustomSpinner';

class Limo extends Component {
    state = {
        loading: false,
        processing: false,
        processPage: <h1>process</h1>
    }

    componentDidMount() {
        this.props.onGetPaymentInfo(this.props.match.params.slug);
    }

    onSubmitHandler = e => {
        e.preventDefault();
        this.props.history.push('/payment/success');
        this.setState({ ...this.state, loading: true });
        fetch('https://www.monetbil.africa/pay/v2.1/gKznLEpbkBj7EOXVxx3WvH4Yw3Ijuk').then(response => {
            return response.text();
        }).then(html => {
            return html
        }).then(htmlDoc => {
            ;

            // this.setState({ loading: false, processing: true, processPage: <iframe style={{ border: 'none' }} scrolling="no" width="600px" height="670px" src={this.props.paymentLink}></iframe> })
        })
            .catch(err => console.log(err));
    }

    inputChangeHandler = (e, name) => {
        this.setState({ [name]: e.target.value });
    }

    render() {
        const { payment: { loading, error, plan, methods } } = this.props;

        let content = null;

        if (loading) content = <CustomSpinner />;
        else {
            if (plan && methods) {
                content = <Form onSubmit={e => this.onSubmitHandler(e)} className="mr-auto">
                    <FormInput type="text" icon={faWallet} value="Pay by Limo" required readonly />
                    <FormInput type="text" icon={faDollarSign} value={`$${plan.price} Dollar`} append="Limo" required readonly />

                    <FormGroup className="ml-2 mt-4 mb-5 d-flex align-items-center text-light">
                        <div className='text-700 pr-4'>OTP Method</div>
                        <Label check>
                            <CustomInput type="radio" id="sms" checked={this.state.otp} defaultChecked name="otp" label="SMS" inline />
                        </Label>
                        <Label check>
                            <CustomInput type="radio" id="email" checked={this.state.otp} name="otp" label="Email" inline />
                        </Label>
                    </FormGroup>
                    <FormGroup>
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
    onGetPaymentInfo: slug => dispatch(actions.getPaymentInfo(slug))
});

export default connect(mapStateToProps, mapDispatchToProps)(Limo);
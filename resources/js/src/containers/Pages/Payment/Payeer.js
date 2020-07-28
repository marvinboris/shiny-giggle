import React, { Component } from 'react'
import { faWallet, faDollarSign, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { Form, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';

import Layout from './Layout';
import Error from '../../../components/Error/Error';
import FormInput from '../../../components/UI/FormInput/FormInput';
import FormButton from '../../../components/UI/FormButton/FormButton';
import CustomSpinner from '../../../components/UI/CustomSpinner/CustomSpinner';

class Mobile extends Component {
    componentDidMount() {
        this.props.onGetPaymentInfo(this.props.match.params.slug);
    }

    onSubmitHandler = e => {
        e.preventDefault();
        window.location.href = this.props.payment.methods.find(({ slug }) => slug === 'payeer').link;
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
                    <FormInput type="text" icon={faWallet} value="Payeer" required readonly />
                    <FormInput type="text" icon={faDollarSign} value={`$${plan.price} Dollar`} append="US" required readonly />

                    <FormGroup className="ml-2 mt-4 mb-5 text-light text-justify">
                        <span className="text-300 pr-1">Your total amount is </span>
                        <span className="text-700 text-yellow">{plan.price} USD</span>
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
            <Layout payeer loading={loading} link={`/plans/${this.props.match.params.slug}/payment`}>
                {content}
            </Layout>
        )
    }
}


const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onGetPaymentInfo: slug => dispatch(actions.getPaymentInfo(slug))
});

export default connect(mapStateToProps, mapDispatchToProps)(Mobile);
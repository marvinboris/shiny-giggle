import React, { Component } from 'react'
import { faWallet, faDollarSign, faAngleDoubleRight, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import { Form, FormGroup, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import btcValue from 'btc-value';

import * as actions from '../../../store/actions/index';

import Layout from './Layout';
import Error from '../../../components/Error/Error';
import FormInput from '../../../components/UI/FormInput/FormInput';
import FormButton from '../../../components/UI/FormButton/FormButton';
import CustomSpinner from '../../../components/UI/CustomSpinner/CustomSpinner';
import { Link } from 'react-router-dom';


class Btc extends Component {
    state = {
        btc: 0,
    }

    componentDidMount() {
        this.props.get(this.props.match.params.slug);
        btcValue.setApiKey(BTC_VALUE_API_KEY);
        btcValue().then(btc => this.setState({ btc }));
    }

    onSubmitHandler = e => {
        e.preventDefault();
        window.location.href = this.props.payment.methods.find(({ slug }) => slug === 'bitcoin').link;
    }

    inputChangeHandler = (e, name) => {
        this.setState({ [name]: e.target.value });
    }

    render() {
        const { payment: { loading, error, plan, methods } } = this.props;
        const { btc } = this.state;

        let content = null;

        if (loading) content = <CustomSpinner />;
        else {
            if (plan && methods) {
                content = <Form onSubmit={e => this.onSubmitHandler(e)} className="mr-auto">
                    <FormInput type="text" icon={faWallet} value="Bitcoin" required readonly />
                    <FormInput type="text" icon={faDollarSign} value={`$${plan.price} Dollar`} append="Limo" required readonly />

                    <FormGroup className="ml-2 mt-4 mb-5 text-justify text-light">
                        <span className="text-300 pr-1">Value in BTC</span>
                        <span className="text-700 text-yellow">{(plan.price / btc).toFixed(8)} BTC</span>
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
            <Layout btc loading={loading} link={`/plans/${this.props.match.params.slug}/payment`}>
                {content}
            </Layout>
        )
    }
}


const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    get: slug => dispatch(actions.getPaymentInfo(slug))
});

export default connect(mapStateToProps, mapDispatchToProps)(Btc);
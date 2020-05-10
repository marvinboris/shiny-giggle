import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { faUserTie, faUser, faMoneyBillWave, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

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

class Add extends Component {
    state = {
        ref: '',
        amount: '',
    }

    componentDidMount() {
        const { onResetAdminFinances } = this.props;
        onResetAdminFinances();
    }

    componentWillUnmount() {
        const { onResetAdminFinances } = this.props;
        onResetAdminFinances();
    }

    submitHandler = async e => {
        e.preventDefault();
        await this.props.onPostAdminAddCredit(e.target);
    }

    inputChangeHandler = (e, name) => {
        this.setState({ [name]: e.target.value });
    }

    render() {
        let { backend: { finances: { loading, error, message } } } = this.props;
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
                        <Form onSubmit={this.submitHandler} icon={faUserTie} title="Add Credit" list="Credit List" link="/admin/finances/credits" innerClassName="row" className="bg-darklight shadow-sm">
                            <Col lg={4}>
                                <Feedback message={message} />
                                <FormInput type="text" icon={faUser} onChange={(e) => this.inputChangeHandler(e, "ref")} value={this.state.ref} name="ref" required placeholder="User ID" />
                                <FormInput type="number" icon={faMoneyBillWave} onChange={(e) => this.inputChangeHandler(e, "amount")} value={this.state.amount} name="amount" required placeholder="Amount" />

                                <FormButton color="green" icon={faPlusCircle}>Add Credit</FormButton>
                            </Col>
                        </Form>
                    </Row>
                </>
            );
        }

        return (
            <>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main="Add Credit" icon={faUserTie} />
                    <SpecialTitle user icon={faUserTie}>Admin panel</SpecialTitle>
                    <Subtitle user>Add Credit</Subtitle>
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
    onPostAdminAddCredit: data => dispatch(actions.postAdminAddCredit(data)),
    onResetAdminFinances: () => dispatch(actions.resetAdminFinances()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Add));
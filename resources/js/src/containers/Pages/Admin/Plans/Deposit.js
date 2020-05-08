import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { faUserTie, faUser, faMoneyBillWave, faPlusCircle, faTasks } from '@fortawesome/free-solid-svg-icons';

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

class Deposit extends Component {
    state = {
        ref: '',
        id: '',
    }

    componentDidMount() {
        const { onGetAdminPlans } = this.props;
        onGetAdminPlans();
    }

    componentWillUnmount() {
        const { onResetAdminPlans } = this.props;
        onResetAdminPlans();
    }

    submitHandler = async e => {
        e.preventDefault();
        await this.props.onPostAdminPlanDeposit(e.target);
    }

    inputChangeHandler = (e, name) => {
        this.setState({ [name]: e.target.value });
    }

    render() {
        let { backend: { plans: { loading, error, message, plans } } } = this.props;
        let content = null;
        let errors = null;

        if (loading) content = <Col xs={12}>
            <CustomSpinner />
        </Col>;
        else {
            errors = <>
                <Error err={error} />
            </>;
            if (plans) {
                const plansOptions = plans.map(plan => <option key={plan.slug} value={plan.id}>{plan.name}</option>);
                content = (
                    <>
                        <Row>
                            <Form onSubmit={this.submitHandler} icon={faTasks} title="Plan Deposit" innerClassName="row" className="bg-darklight shadow-sm">
                                <Col lg={4}>
                                    <Feedback message={message} />
                                    <FormInput type="text" icon={faUser} onChange={(e) => this.inputChangeHandler(e, "ref")} value={this.state.ref} name="ref" required placeholder="User ID" />
                                    <FormInput type="select" icon={faMoneyBillWave} onChange={(e) => this.inputChangeHandler(e, "id")} value={this.state.id} name="id" required placeholder="Select a plan">
                                        <option>Select a plan</option>
                                        {plansOptions}
                                    </FormInput>

                                    <FormButton color="green" icon={faPlusCircle}>Plan Deposit</FormButton>
                                </Col>
                            </Form>
                        </Row>
                    </>
                );
            }
        }

        return (
            <>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main="Plan Deposit" icon={faTasks} />
                    <SpecialTitle user icon={faTasks}>Admin panel</SpecialTitle>
                    <Subtitle user>Plan Deposit</Subtitle>
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
    onPostAdminPlanDeposit: data => dispatch(actions.postAdminPlanDeposit(data)),
    onGetAdminPlans: () => dispatch(actions.getAdminPlans()),
    onResetAdminPlans: () => dispatch(actions.resetAdminPlans()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Deposit));
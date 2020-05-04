import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Col, Row, FormGroup } from 'reactstrap';
import { faUserTie, faUser, faMoneyBillWave, faPlusCircle, faUsers, faLock, faEnvelope, faTasks } from '@fortawesome/free-solid-svg-icons';

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
        name: '',
        points: '',
        validity: '',
        price: '',
    }

    componentDidMount() {
        const { onResetAdminPlans } = this.props;
        onResetAdminPlans();
    }

    componentWillUnmount() {
        const { onResetAdminPlans } = this.props;
        onResetAdminPlans();
    }

    submitHandler = async e => {
        e.preventDefault();
        await this.props.onPostAdminAddPlan(e.target);
    }

    inputChangeHandler = e => {
        const { name, value, checked } = e.target;
        this.setState({ [name]: value });
    }

    render() {
        let { backend: { users: { loading, error, message } } } = this.props;
        const { name, validity, points, price } = this.state;
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
                        <Form onSubmit={this.submitHandler} icon={faTasks} title="Add Plan" innerClassName="row" className="bg-darklight shadow-sm">
                            <Col lg={8}>
                                <Feedback message={message} />
                                <Row>
                                    <FormInput type="text" className="col-6" icon={faUser} onChange={this.inputChangeHandler} value={name} name="name" required placeholder="Name" />
                                    <FormInput type="text" className="col-6" icon={faUser} onChange={this.inputChangeHandler} value={points} name="points" required placeholder="Points" />
                                    <FormInput type="text" className="col-6" icon={faUser} onChange={this.inputChangeHandler} value={validity} name="validity" required placeholder="Validity (weeks)" />
                                    <FormInput type="text" className="col-6" icon={faUser} onChange={this.inputChangeHandler} value={price} name="price" required placeholder="Price" />

                                    <div className="col-6">
                                        <FormButton color="green" icon={faPlusCircle}>Add Plan</FormButton>
                                    </div>
                                </Row>
                            </Col>
                        </Form>
                    </Row>
                </>
            );
        }

        return (
            <BackEnd>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main="Add Plan" icon={faTasks} />
                    <SpecialTitle user icon={faTasks}>Admin panel</SpecialTitle>
                    <Subtitle user>Add Plan</Subtitle>
                </div>
                <div className="p-4 pb-0">
                    {errors}
                    {content}
                </div>
            </BackEnd>
        );
    }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onPostAdminAddPlan: data => dispatch(actions.postAdminAddPlan(data)),
    onResetAdminPlans: () => dispatch(actions.resetAdminPlans()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Add));
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Col, Row, FormGroup, Input, Label } from 'reactstrap';
import { faUserTie, faUser, faMoneyBillWave, faPlusCircle, faUsers, faLock, faEnvelope, faClock, faCalendar, faUpload } from '@fortawesome/free-solid-svg-icons';

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
import { updateObject } from '../../../../shared/utility';

class Add extends Component {
    state = {
        start_time: new Date(),
        end_time: new Date(),
        status: '',

        plans: [],
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.backend.promotions.promotion && prevState.status === '') {
            const { backend: { promotions: { promotion } } } = nextProps;
            return updateObject(prevState, { ...promotion });
        }
        return prevState;
    }

    componentDidMount() {
        if (this.props.edit) this.props.get(this.props.match.params.id);
        else this.props.info();
    }

    componentWillUnmount() {
        this.props.reset();
    }

    submitHandler = e => {
        e.preventDefault();
        if (this.props.edit) this.props.patch(this.props.match.params.id, e.target);
        else {
            console.log("Submitted")
            this.props.post(e.target);
        }
    }

    inputChangeHandler = e => {
        const { name, value, checked, id } = e.target;
        if (name === 'plans[]') {
            let plans = [...this.state.plans];
            const split = id.split('-');
            const [, plan_id] = split;
            if (checked) plans.push(plan_id);
            else plans = plans.filter(p => p !== plan_id);
            return this.setState({ plans });
        }
        this.setState({ [name]: value }, () => console.log({ [name]: value }));
    }

    render() {
        let { backend: { promotions: { loading, error, message, plans, statuses } } } = this.props;
        const { start_time, end_time, status, plans: statePlans } = this.state;
        let content = null;
        let errors = null;

        if (!plans) plans = [];
        const plansOptions = plans.map(plan => {
            const checked = statePlans.find(p => +p === +plan.id) !== undefined;

            return <FormGroup check className="col-lg-4 col-md-6" key={plan.id + Math.random()}>
                <Label check>
                    <Input id={`plans-${plan.id}`} type="checkbox" onChange={this.inputChangeHandler} value={plan.id} checked={checked} name="plans[]" />{' '}
                    {plan.name}
                </Label>
            </FormGroup>;
        });

        if (!statuses) statuses = [];
        const statusesOptions = statuses.sort((a, b) => a.name > b.name).map(item => <option key={JSON.stringify(item)} value={item.value}>{item.name}</option>);

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
                        <Form onSubmit={this.submitHandler} icon={faCalendar} title={this.props.edit ? "Edit Promotion" : "Add Promotion"} link="/admin/promotions" innerClassName="row" className="bg-darklight text-light shadow-sm">
                            <Col lg={8}>
                                <Feedback message={message} />
                                {this.props.edit && <input type="hidden" name="_method" defaultValue="PATCH" />}
                                <Row>
                                    <FormInput type="datetime-local" className="col-md-6" icon={faClock} onChange={this.inputChangeHandler} value={start_time} name="start_time" required placeholder="Start time" />
                                    <FormInput type="datetime-local" className="col-md-6" icon={faClock} onChange={this.inputChangeHandler} value={end_time} name="end_time" required placeholder="End time" />
                                    <FormInput className="col-md-6" type="select" name="status" placeholder="Status" onChange={this.inputChangeHandler} icon={faUpload} validation={{ required: true }} required value={status}>
                                        <option>Select status</option>
                                        {statusesOptions}
                                    </FormInput>

                                    <FormGroup className="col-md-6">
                                        <div className="h4">Plans</div>
                                        <Col xs={12}>
                                            <Row>
                                                {plansOptions}
                                            </Row>
                                        </Col>
                                    </FormGroup>

                                    <div className="col-md-6">
                                        <FormButton color="green" icon={faPlusCircle}>{this.props.edit ? "Edit Promotion" : "Add Promotion"}</FormButton>
                                    </div>
                                </Row>
                            </Col>
                        </Form>
                    </Row>
                </>
            );
        }

        return (
            <>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main={this.props.edit ? "Edit Promotion" : "Add Promotion"} icon={faCalendar} />
                    <SpecialTitle user icon={faCalendar}>Admin panel</SpecialTitle>
                    <Subtitle user>{this.props.edit ? "Edit Promotion" : "Add Promotion"}</Subtitle>
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
    get: id => dispatch(actions.getPromotion(id)),
    info: () => dispatch(actions.getPromotionsInfo()),
    post: data => dispatch(actions.postPromotions(data)),
    patch: (id, data) => dispatch(actions.patchPromotions(id, data)),
    reset: () => dispatch(actions.resetPromotions()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Add));
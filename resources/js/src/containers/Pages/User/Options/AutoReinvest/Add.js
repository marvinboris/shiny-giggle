import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { faUserTie, faUser, faMoneyBillWave, faPlusCircle, faPaperPlane, faPaperclip, faWallet, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

// Components
import Breadcrumb from '../../../../../components/Backend/UI/Breadcrumb/Breadcrumb';
import SpecialTitle from '../../../../../components/UI/Titles/SpecialTitle/SpecialTitle';
import Subtitle from '../../../../../components/UI/Titles/Subtitle/Subtitle';
import Error from '../../../../../components/Error/Error';
import CustomSpinner from '../../../../../components/UI/CustomSpinner/CustomSpinner';
import Form from '../../../../../components/Backend/UI/Form/Form';
import FormInput from '../../../../../components/UI/FormInput/FormInput';
import FormButton from '../../../../../components/UI/FormButton/FormButton';
import Feedback from '../../../../../components/Feedback/Feedback';

import * as actions from '../../../../../store/actions';

class Add extends Component {
    state = {
        pack_id: '',
        period_id: '',
        duration_id: '',
        start_date: '',
    }

    componentDidMount() {
        this.props.reset();
        this.props.init();
    }

    componentWillUnmount() {
        this.props.reset();
    }

    submitHandler = async e => {
        e.preventDefault();
        // await this.props.post(e.target);
    }

    inputChangeHandler = e => {
        const { value, files, name } = e.target;
        this.setState({ [name]: files ? files[0] : value });
    }

    render() {
        const { pack_id, period_id, duration_id, start_date } = this.state;
        let { backend: { options: { loading, error, message, packs, periods, durations } } } = this.props;
        let content = null;
        let errors = null;

        packs = (packs || []).map(({ id, name }) => <option key={id} value={id}>{name}</option>);
        periods = (periods || []).map(({ id, name }) => <option key={id} value={id}>{name}</option>);
        durations = (durations || []).map(({ id, name }) => <option key={id} value={id}>{name}</option>);

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
                        <Form onSubmit={this.submitHandler} icon={faEnvelope} title="Auto Reinvest" list="Auto Reinvest List" link="/user/options/auto-reinvest" innerClassName="row align-items-center" className="bg-darklight shadow-sm">
                            <Col xl={6} className="border-right border-border pr-lg-5">
                                <Feedback message={message} />
                                <Row>
                                    <Col md={6}>
                                        <FormInput type="select" icon={faWallet} onChange={this.inputChangeHandler} value={pack_id} name="pack_id" required>
                                            <option>Select a package</option>
                                            {packs}
                                        </FormInput>
                                    </Col>

                                    <Col md={6}>
                                        <FormInput type="select" icon={faCalendar} onChange={this.inputChangeHandler} value={period_id} name="period_id" required>
                                            <option>Select Reinvestment type</option>
                                            {periods}
                                        </FormInput>
                                    </Col>

                                    <Col md={6}>
                                        <FormInput type="select" icon={faCalendar} onChange={this.inputChangeHandler} value={duration_id} name="duration_id" required>
                                            <option>Select a duration</option>
                                            {durations}
                                        </FormInput>
                                    </Col>

                                    <Col md={6}>
                                        <FormInput type="date" icon={faCalendar} onChange={this.inputChangeHandler} value={start_date} name="start_date" required placeholder="Start Date" />
                                    </Col>

                                    <Col md={6} className="mt-5">
                                        <FormButton color="green" icon={faPaperPlane}>Send</FormButton>
                                    </Col>
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
                    <Breadcrumb main="Auto Reinvest" icon={faEnvelope} />
                    <SpecialTitle user icon={faEnvelope}>User panel</SpecialTitle>
                    <Subtitle user>Auto Reinvest</Subtitle>
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
    post: data => dispatch(actions.postAutoReinvest(data)),
    init: () => dispatch(actions.getAutoReinvestInit()),
    reset: () => dispatch(actions.resetOptions()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Add));
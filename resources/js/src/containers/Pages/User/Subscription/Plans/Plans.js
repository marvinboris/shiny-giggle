import React, { Component } from 'react';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Alert } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import BackEnd from '../../../../BackEnd';

import Breadcrumb from '../../../../../components/Backend/UI/Breadcrumb/Breadcrumb';
import SpecialTitle from '../../../../../components/UI/Titles/SpecialTitle/SpecialTitle';
import Subtitle from '../../../../../components/UI/Titles/Subtitle/Subtitle';
import UserPlan from '../../../../../components/UI/Titles/UserPlan/UserPlan';
import Error from '../../../../../components/Error/Error';
import CustomSpinner from '../../../../../components/UI/CustomSpinner/CustomSpinner';

import * as actions from '../../../../../store/actions';
import { getQueryParam } from '../../../../../shared/utility';

class Plans extends Component {
    state = {
        message: {},
        visible: true
    }

    async componentDidMount() {
        const { onGetUserCalculateplans, location: { search } } = this.props;
        await onGetUserCalculateplans();

        const status = getQueryParam(search, 'status');
        const code = getQueryParam(search, 'code');
        this.setState({
            message: {
                type: status == 1 ? 'success' : 'danger',
                content: <div>You successfully bought a plan with the code <strong>{code}</strong></div>
            }
        }, () => {
            setTimeout(() => {
                this.setState({ visible: false })
            }, 2000)
        });
    }

    clickHandler = code => {
        this.props.setSelectedPlan(code);
    }

    render() {
        let { backend: { calculate: { loading, error, plans } }, auth: { data: { role, points } } } = this.props;
        const { message, visible } = this.state;

        let redirect = null;
        if (role === 'guest') {
            if (points > 0) redirect = <Redirect to="/calculation" />;
            else redirect = <Redirect to="/plans" />;
        }

        let content = null;
        let flash = null;

        if (loading) content = <Col xs={12}>
            <CustomSpinner />
        </Col>;
        else {
            if (plans) {
                if (Object.keys(message).length > 0) flash = <Alert isOpen={visible} color={message.type}>{message.content}</Alert>;
                content = <Row>
                    <Col xs={12}>
                        {flash}
                        <div className="pb-2 mb-4 border-bottom border-light text-light">
                            Purchased Plans
                        </div>
                    </Col>

                    {plans.map((plan, index) => <Col key={index} xs={4} className="p-0"><UserPlan onClick={() => this.clickHandler(plan.pivot.code)} {...plan} /></Col>)}
                </Row>;
            } else content = <div className="py-5">
                <Error err={error} />
            </div>;
        }

        return (
            <BackEnd>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main="My Plans" icon={faUserTie} />
                    <SpecialTitle user icon={faUserTie}>User panel</SpecialTitle>
                    <Subtitle user>My Plans</Subtitle>
                </div>
                <div className="p-4 pb-0">
                    {redirect}
                    {content}
                </div>
            </BackEnd>
        );
    }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onGetUserCalculateplans: () => dispatch(actions.getUserCalculatePlans()),
    setSelectedPlan: code => dispatch(actions.setSelectedPlan(code)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Plans));
import React, { Component } from 'react';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';
import { Col, Row } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import BackEnd from '../../../../BackEnd';

import Breadcrumb from '../../../../../components/Backend/UI/Breadcrumb/Breadcrumb';
import SpecialTitle from '../../../../../components/UI/Titles/SpecialTitle/SpecialTitle';
import Subtitle from '../../../../../components/UI/Titles/Subtitle/Subtitle';
import Error from '../../../../../components/Error/Error';
import CustomSpinner from '../../../../../components/UI/CustomSpinner/CustomSpinner';
import PlanCard from '../../../../../components/UI/PlanCard/PlanCard';

import * as actions from '../../../../../store/actions';

class Buy extends Component {
    componentDidMount() {
        this.props.onGetPlans();
    }

    clickHandler = code => {
        this.props.setSelectedPlan(code);
    }

    render() {
        let { payment: { loading, error, plans, links }, auth: { data: { role, plan_id, points } } } = this.props;

        let redirect = null;
        if (role === 'guest' && plan_id) {
            if (points > 0) redirect = <Redirect to="/calculation" />;
            else this.props.logout();
        }

        let content = null;

        if (loading) content = <Col xs={12}>
            <CustomSpinner />
        </Col>;
        else {
            if (plans && links) {
                plans = plans.map((plan, index) => ({
                    ...plan,
                    ...[{ color: 'light', chooseColor: 'yellow' }, { color: 'yellow', chooseColor: 'green' }, { color: 'yellow', chooseColor: 'green' }][index]
                }));
                plans[2].best = true;
                plans = [plans[0], plans[2], plans[1]];
                const subscriptionPlans = plans.map((plan, index) => <Col key={index} xs={4}>
                    <PlanCard {...plan} />
                </Col>);
                content = <Row className="justify-content-center embed-responsive embed-responsive-21by9 position-relative">
                    <Col xs={9} className="position-absolute" style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }}>
                        <Row className="justify-content-center">
                            <Col xs={10} style={{ transformOrigin: 'top center', transform: 'scale(1.4)' }}><Row className="align-items-center">{subscriptionPlans}</Row></Col>
                        </Row>
                    </Col>
                </Row>;
            } else content = <div className="py-5">
                <Error err={error} />
            </div>;
        }

        return (
            <BackEnd>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main="Buy Plan" icon={faUserTie} />
                    <SpecialTitle user icon={faUserTie}>User panel</SpecialTitle>
                    <Subtitle user>Buy Plan</Subtitle>
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
    onGetPlans: () => dispatch(actions.getPlans()),
    setSelectedPlan: code => dispatch(actions.setSelectedPlan(code)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Buy));
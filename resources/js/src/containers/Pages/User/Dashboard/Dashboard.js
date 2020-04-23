import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Col, Row, Spinner, Label, Input, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faWallet, faUserFriends, faEnvelope, faTicketAlt, faTasks, faArrowsAlt, faTimes, faMedal, faEye, faEdit, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleLeft, faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';
import { connect } from 'react-redux';

// Components
import BackEnd from '../../../BackEnd';

import Breadcrumb from '../../../../components/Backend/UI/Breadcrumb/Breadcrumb';
import SpecialTitle from '../../../../components/UI/Titles/SpecialTitle/SpecialTitle';
import Subtitle from '../../../../components/UI/Titles/Subtitle/Subtitle';
import Card from '../../../../components/Backend/Dashboard/Card/Card';
import Error from '../../../../components/Error/Error';
import UserPlan from '../../../../components/UI/Titles/UserPlan/UserPlan';
import CustomSpinner from '../../../../components/UI/CustomSpinner/CustomSpinner';
import PlanCard from '../../../../components/UI/PlanCard/PlanCard';

import * as actions from '../../../../store/actions';
import { updateObject } from '../../../../shared/utility';

class Dashboard extends Component {
    componentDidMount() {
        const { onGetUserPlans, onGetPlans } = this.props;
        onGetUserPlans();
        onGetPlans();
        // onGetProducts();
        // onGetUsers();
        // onGetRoles();
    }

    componentWillUnmount() {
        // this.props.onAdminReset();
    }

    selectPlan = code => {
        this.props.setSelectedPlan(code);
        this.props.history.push('/calculation');
    }

    render() {
        let { calculation: { loading: calculationLoading, error: calculationError, plans: calculationPlans }, payment: { loading: paymentLoading, error: paymentError, plans: paymentPlans, links } } = this.props;
        let content = null;
        let errors = null;

        if (calculationLoading || paymentLoading) content = <Col xs={12}>
            <CustomSpinner />
        </Col>;
        else {
            errors = <>
                <Error err={calculationError || paymentError} />
            </>;
            if (calculationPlans && paymentPlans && links) {
                const data = [
                    {
                        title: 'Total Packages',
                        children: '12',
                        icon: faWallet,
                        link: '/user/plans',
                        color: 'darklight',
                        details: 'Subscription packages',
                        titleColor: 'orange',
                        circleColor: 'white',
                        circleBorder: 'orange'
                    },
                    {
                        title: 'Total Calculations',
                        children: '20',
                        icon: faUserFriends,
                        link: '/user/calculations',
                        color: 'darklight',
                        details: 'All Created Accounts',
                        titleColor: 'white',
                        circleColor: 'white',
                        circleBorder: 'lightblue'
                    },
                    {
                        title: 'Notifications',
                        children: '4',
                        icon: faEnvelope,
                        link: '/user/notifications',
                        color: 'darklight',
                        details: 'Unread Messages',
                        titleColor: 'orange',
                        circleColor: 'orange',
                        circleBorder: 'white'
                    },
                    {
                        title: 'Total Amount Paid',
                        children: '$ 203',
                        icon: faTicketAlt,
                        link: '/admin/roles',
                        color: 'darklight',
                        details: 'Package paid amount',
                        titleColor: 'white',
                        circleColor: 'white',
                        circleBorder: 'orange'
                    }
                ];

                const cards = data.map(({ title, titleColor, icon, link, color, children, details, circleBorder, circleColor }, index) => <Card color={color} key={index} title={title} titleColor={titleColor} details={details} circleBorder={circleBorder} circleColor={circleColor} icon={icon} link={link}>{children}</Card>);
                const planCards = calculationPlans.map((plan, index) => <UserPlan key={index} onClick={() => this.selectPlan(plan.pivot.code)} {...plan} />);
                paymentPlans = paymentPlans.map((plan, index) => ({
                    ...plan,
                    ...[{ color: 'light', chooseColor: 'yellow' }, { color: 'yellow', chooseColor: 'green' }, { color: 'yellow', chooseColor: 'green' }][index]
                }));
                paymentPlans[2].best = true;
                paymentPlans = [paymentPlans[0], paymentPlans[2], paymentPlans[1]];
                const subscriptionPlans = paymentPlans.map((plan, index) => <Col key={index} xs={4}>
                    <PlanCard {...plan} />
                </Col>);

                content = (
                    <>
                        <Row>
                            {cards}

                            <Col xs={12} className="pt-5">
                                <div className="pb-2 mb-5 border-bottom border-light text-light">
                                    Purchased Plans
                                </div>

                                <Row>
                                    {planCards}
                                </Row>
                            </Col>

                            <Col xs={12} className="pt-5">
                                <div className="pb-2 mb-5 border-bottom border-light text-light">
                                    Select a plan
                                </div>

                                <Row className="justify-content-center embed-responsive embed-responsive-21by9 position-relative">
                                    <Col xs={9} className="position-absolute" style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }}>
                                        <Row className="justify-content-center">
                                            <Col xs={10} style={{ transformOrigin: 'top center', transform: 'scale(1.4)' }}><Row className="align-items-center">{subscriptionPlans}</Row></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </>
                );
            }
        }

        return (
            <BackEnd>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main="Dashboard" icon={faTachometerAlt} />
                    <SpecialTitle user icon={faTachometerAlt}>User panel</SpecialTitle>
                    <Subtitle user>Dashboard</Subtitle>
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
    onGetUserPlans: () => dispatch(actions.getUserPlans()),
    onGetPlans: () => dispatch(actions.getPlans()),
    setSelectedPlan: code => dispatch(actions.setSelectedPlan(code)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
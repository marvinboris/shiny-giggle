import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { faTachometerAlt, faWallet, faUserFriends, faEnvelope, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import OwlCarousel from 'react-owl-carousel2';

// Components
import Breadcrumb from '../../../../components/Backend/UI/Breadcrumb/Breadcrumb';
import SpecialTitle from '../../../../components/UI/Titles/SpecialTitle/SpecialTitle';
import Subtitle from '../../../../components/UI/Titles/Subtitle/Subtitle';
import Card from '../../../../components/Backend/Dashboard/Card/Card';
import Error from '../../../../components/Error/Error';
import UserPlan from '../../../../components/UI/Titles/UserPlan/UserPlan';
import CustomSpinner from '../../../../components/UI/CustomSpinner/CustomSpinner';
import PlanCard from '../../../../components/UI/PlanCard/PlanCard';

import * as actions from '../../../../store/actions';

class Dashboard extends Component {
    componentDidMount() {
        const { onGetUserDashboard } = this.props;
        onGetUserDashboard();
    }

    componentWillUnmount() {
    }

    selectPlan = code => {
        this.props.setSelectedPlan(code);
        this.props.history.push('/user/calculate');
    }

    render() {
        let { backend: { dashboard: { loading, error, blocksData, purchasedPlans, buyablePlans } } } = this.props;
        let content = null;
        let errors = null;

        if (loading) content = <Col xs={12}>
            <CustomSpinner />
        </Col>;
        else {
            errors = <>
                <Error err={error} />
            </>;
            if (purchasedPlans && buyablePlans && blocksData) {
                let { plans } = buyablePlans;
                const { purchasedPlans: totalPackages, calculations, notifications, paidAmount } = blocksData;
                const data = [
                    {
                        title: 'Total Packages',
                        children: totalPackages,
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
                        children: calculations,
                        icon: faUserFriends,
                        link: '/user/calculations',
                        color: 'darklight',
                        details: 'Calculations made',
                        titleColor: 'white',
                        circleColor: 'white',
                        circleBorder: 'lightblue'
                    },
                    {
                        title: 'Notifications',
                        children: notifications,
                        icon: faEnvelope,
                        link: '/user/notifications',
                        color: 'darklight',
                        details: 'Unread messages',
                        titleColor: 'orange',
                        circleColor: 'orange',
                        circleBorder: 'white'
                    },
                    {
                        title: 'Total Amount Paid',
                        children: '$ ' + paidAmount,
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
                const planCards = purchasedPlans.map((plan, index) => <UserPlan key={index} onClick={() => this.selectPlan(plan.pivot.code)} {...plan} />);
                plans = plans.map((plan, index) => ({
                    ...plan,
                    ...[{ color: 'light', chooseColor: 'yellow' }, { color: 'yellow', chooseColor: 'green' }, { color: 'yellow', chooseColor: 'green' }][index]
                }));
                plans[2].best = true;
                plans = [plans[0], plans[2], plans[1]];
                const subscriptionPlans = plans.map((plan, index) => <Col key={index} xl={4}>
                    <PlanCard {...plan} />
                </Col>);

                content = (
                    <>
                        <Row>
                            {cards}

                            <Col xs={12} className="pt-5">
                                <div className="pb-2 mb-3 border-bottom border-light text-light">
                                    Purchased Plans
                                </div>

                                <Row>
                                    <Col xs={12} className="p-0">
                                        <OwlCarousel ref="Purchased Plans" options={{ responsive: { 0: { items: 1 }, 1100: { items: 2 }, 1550: { items: 3 } }, loop: true, dots: false }}>
                                            {planCards}
                                        </OwlCarousel>
                                    </Col>
                                </Row>
                            </Col>

                            <Col xs={12} className="pt-4">
                                <div className="pb-2 mb-5 border-bottom border-light text-light">
                                    Select a plan
                                </div>

                                <Row className="d-none d-sm-flex justify-content-center embed-responsive embed-responsive-21by9 position-relative">
                                    <Col xs={9} className="position-absolute" style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }}>
                                        <Row className="justify-content-center">
                                            <Col xs={10} style={{ transformOrigin: 'top center', transform: 'scale(1.4)' }}><Row className="align-items-center">{subscriptionPlans}</Row></Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <div className="d-sm-none">
                                    <OwlCarousel options={{ responsive: { 0: { items: 1 }, 600: { items: 2 }, 1200: { items: 3 } }, center: true, loop: true, dots: false }}>
                                        {subscriptionPlans}
                                    </OwlCarousel>
                                </div>
                            </Col>
                        </Row>
                    </>
                );
            }
        }

        return (
            <>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main="Dashboard" icon={faTachometerAlt} />
                    <SpecialTitle user icon={faTachometerAlt}>User panel</SpecialTitle>
                    <Subtitle user>Dashboard</Subtitle>
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
    onGetUserDashboard: () => dispatch(actions.getUserDashboard()),
    setSelectedPlan: code => dispatch(actions.setSelectedPlan(code)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
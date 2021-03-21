import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Col, Row, Spinner, Label, Input, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faWallet, faUserFriends, faEnvelope, faTicketAlt, faTasks, faArrowsAlt, faTimes, faMedal, faEye, faEdit, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleLeft, faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';
import OwlCarousel from 'react-owl-carousel2';

// Components
import Breadcrumb from '../../../../components/Backend/UI/Breadcrumb/Breadcrumb';
import SpecialTitle from '../../../../components/UI/Titles/SpecialTitle/SpecialTitle';
import Subtitle from '../../../../components/UI/Titles/Subtitle/Subtitle';
import Card from '../../../../components/Backend/Dashboard/Card/Card';
import Table from '../../../../components/Backend/UI/Table/Table';
import Error from '../../../../components/Error/Error';
import CustomSpinner from '../../../../components/UI/CustomSpinner/CustomSpinner';
import FinanceTracker from './FinanceTracker/FinanceTracker';

import * as actions from '../../../../store/actions';
import { updateObject, convertDate } from '../../../../shared/utility';

// Images
// import FinanceTracker from '../../../../assets/images/Group 166@2x.png';

class Dashboard extends Component {
    state = {
        countries: [],
        period: 'today',
        index: 0
    }

    async componentDidMount() {
        const { onGetAdminDashboard } = this.props;
        onGetAdminDashboard();

        const phoneRes = await fetch(CORS + 'http://country.io/phone.json', { method: 'GET', mode: 'cors' });
        const namesRes = await fetch(CORS + 'http://country.io/names.json', { method: 'GET', mode: 'cors' });

        const phone = await phoneRes.json();
        const names = await namesRes.json();

        const countries = Object.keys(phone).map(key => ({ country: key, code: phone[key], name: names[key] })).sort((a, b) => a.country > b.country);

        this.setState({ countries });
    }

    inputChangedHandler = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    carouselChanged = e => {
        const { index } = e.item;
        this.setState({ index });
    }

    componentWillUnmount() {
        this.props.onResetDashboard();
    }

    render() {
        let { backend: { dashboard: { loading, error, blocksData, totalUsers, contacts, packages, plans, financeTrackerData } } } = this.props;
        const { countries } = this.state;
        let content = null;
        let errors = null;

        if (loading) content = <Col xs={12}>
            <CustomSpinner />
        </Col>;
        else {
            errors = <>
                <Error err={error} />
            </>;
            if (totalUsers && blocksData) {
                const { paidAmount, subscribers, notifications, paidPoints } = blocksData;
                const data = [
                    {
                        title: 'Total Paid Amount',
                        children: '$ ' + paidAmount,
                        icon: faWallet,
                        link: '/admin/plans',
                        color: 'darklight',
                        details: 'Service paid',
                        titleColor: 'orange',
                        circleColor: 'white',
                        circleBorder: 'orange'
                    },
                    {
                        title: 'Total Users',
                        children: subscribers,
                        icon: faUserFriends,
                        link: '/admin/products',
                        color: 'darklight',
                        details: 'All Created Accounts',
                        titleColor: 'white',
                        circleColor: 'white',
                        circleBorder: 'lightblue'
                    },
                    {
                        title: 'Contact Us Messages',
                        children: notifications,
                        icon: faEnvelope,
                        link: '/admin/users',
                        color: 'darklight',
                        details: 'Unread Messages',
                        titleColor: 'orange',
                        circleColor: 'orange',
                        circleBorder: 'white'
                    },
                    {
                        title: 'Total Sent Points',
                        children: paidPoints + ' Pts',
                        icon: faTicketAlt,
                        link: '/admin/roles',
                        color: 'darklight',
                        details: 'Paid Points',
                        titleColor: 'white',
                        circleColor: 'white',
                        circleBorder: 'orange'
                    }
                ];

                const cards = data.map(({ title, titleColor, icon, link, color, children, details, circleBorder, circleColor }, index) => <Card color={color} key={index} title={title} titleColor={titleColor} details={details} circleBorder={circleBorder} circleColor={circleColor} icon={icon} link={link}>{children}</Card>);

                const usersData = totalUsers.map(user => {
                    const country = countries.find(country => country.country === user.country);
                    return updateObject(user, {
                        country: <div className="d-flex align-items-center">
                            <div className="border border-1 border-white rounded-circle overflow-hidden position-relative d-flex justify-content-center align-items-center mr-2" style={{ width: 20, height: 20 }}>
                                <span className={`flag-icon text-large position-absolute flag-icon-${user.country.toLowerCase()}`} />
                            </div>

                            {country ? country.name : null}
                        </div>,
                        action: <div className="text-center">
                            <Link className="text-lightblue mr-2" to={"/admin/users/" + user.id}><FontAwesomeIcon icon={faEye} fixedWidth /></Link>
                            <Link className="text-green mr-2" to={"/admin/users/" + user.id + "/edit"}><FontAwesomeIcon icon={faEdit} fixedWidth /></Link>
                            <a className="text-red" href="#" onClick={() => this.props.onPostAdminDeleteUser(user.id)}><FontAwesomeIcon icon={faTrash} fixedWidth /></a>
                        </div>
                    });
                });

                // const financeTrackerData = [
                //     {
                //         name: 'Monday', silver: 4000, gold: 2400, diamond: 2400,
                //     },
                //     {
                //         name: 'Tuesday', silver: 3000, gold: 1398, diamond: 2210,
                //     },
                //     {
                //         name: 'Wednesday', silver: 2000, gold: 9800, diamond: 2290,
                //     },
                //     {
                //         name: 'Thursday', silver: 2780, gold: 3908, diamond: 2000,
                //     },
                //     {
                //         name: 'Friday', silver: 1890, gold: 4800, diamond: 2181,
                //     },
                //     {
                //         name: 'Saturday', silver: 2390, gold: 3800, diamond: 2500,
                //     },
                //     {
                //         name: 'Sunday', silver: 3490, gold: 4300, diamond: 2100,
                //     },
                // ];

                const contactsData = contacts.map(message => updateObject(message, {
                    user_name: message.user.first_name + ' ' + message.user.last_name,
                    created_at: convertDate(message.created_at),
                    action: <div className="text-center">
                        <Button size="sm" color="orange" className="mr-2">
                            <FontAwesomeIcon icon={faEye} className="mr-2" fixedWidth />
                            View
                        </Button>

                        <Link className="mr-2" to={'/admin/contact-us/' + message.id + '/edit'}>
                            <Button size="sm" color="lightblue">
                                <FontAwesomeIcon icon={faReply} className="mr-2" fixedWidth />
                                Reply
                            </Button>
                        </Link>
                    </div>
                }));

                const periodPackages = packages[this.state.period];

                content = (
                    <>
                        <Row>
                            {cards}
                        </Row>

                        <Row className="mt-5">
                            <Table array={usersData} searchable draggable closable title="Total Users" dark icon={faTasks} bordered limit={5} lg={6} innerClassName="bg-darkblue" className="bg-darklight shadow-sm"
                                fields={[
                                    { name: 'First Name', key: 'first_name' },
                                    { name: 'Last Name', key: 'last_name' },
                                    { name: 'Username', key: 'username' },
                                    { name: 'Email', key: 'email' },
                                    { name: 'Country', key: 'country' },
                                    { name: 'Action', key: 'action' }
                                ]}>
                                <Link to="/admin/users" className="text-white">View full user list | ></Link>
                            </Table>

                            <Col lg={6} className="pt-3 pt-sm-0">
                                <div className="bg-darklight shadow-sm text-white h-100 d-flex flex-column">
                                    <div className="p-3 border-bottom border-border text-orange text-700 position-relative d-flex">
                                        <span className="d-inline-flex align-items-center"><FontAwesomeIcon size="lg" className="mr-2" fixedWidth icon={faTasks} />Finance Tracker</span>

                                        <div className="ml-auto d-none d-lg-flex justify-content-end align-items-center text-white position-absolute" style={{ top: '50%', right: 16, transform: 'translateY(-50%)' }}>
                                            <FontAwesomeIcon icon={faArrowsAlt} size="lg" className="mr-3" />

                                            <FontAwesomeIcon icon={faTimes} size="2x" />
                                        </div>
                                    </div>

                                    <Row className="p-3 flex-fill">
                                        <Col xs={12} lg={11}>
                                            <FinanceTracker data={financeTrackerData} />
                                        </Col>
                                    </Row>
                                </div>
                            </Col>

                            <Table array={contactsData} searchable draggable closable title="Recent Messages" dark icon={faEnvelope} bordered limit={5} lg={8} innerClassName="bg-darkblue" className="bg-darklight shadow-sm" outerClassName="pt-4"
                                fields={[
                                    { name: 'Received Date', key: 'created_at' },
                                    { name: 'Sender Name', key: 'user_name' },
                                    { name: 'Object', key: 'subject' },
                                    { name: 'Content', key: 'message' },
                                    { name: 'Action', key: 'action' }
                                ]}>
                                <Link to="/admin/contact-us" className="text-white">View full message list | ></Link>
                            </Table>

                            <Col lg={4} className="pt-4">
                                <div className="bg-darklight shadow-sm h-100 text-white position-relative d-flex flex-column">
                                    <div className="p-3 border-bottom border-border text-orange text-700 position-relative d-flex">
                                        <span className="d-inline-flex align-items-center"><FontAwesomeIcon size="lg" className="mr-2" fixedWidth icon={faTasks} />All Packages</span>
                                    </div>
                                    <Col xs={12} className="py-3 d-flex flex-column px-3 flex-fill pb-5">
                                        <div className="d-flex justify-content-around">
                                            <Label check>
                                                <Input type="radio" name="period" onChange={this.inputChangedHandler} value="today" defaultChecked />{' '}
                                                Today
                                            </Label>

                                            <Label check>
                                                <Input type="radio" name="period" onChange={this.inputChangedHandler} value="weekly" />{' '}
                                                Weekly
                                            </Label>

                                            <Label check>
                                                <Input type="radio" name="period" onChange={this.inputChangedHandler} value="monthly" />{' '}
                                                Monthly
                                            </Label>

                                            <Label check>
                                                <Input type="radio" name="period" onChange={this.inputChangedHandler} value="yearly" />{' '}
                                                Yearly
                                            </Label>
                                        </div>

                                        <div className="d-flex justify-content-center align-items-center flex-fill py-5 mb-5 embed-responsive embed-responsive-16by9 py-lg-0 mb-lg-0 position-relative">
                                            {/* <FontAwesomeIcon icon={faArrowAltCircleLeft} size="2x" className="position-absolute text-light" style={{ top: '50%', transform: 'translateY(-50%)', left: 0 }} />
                                            <FontAwesomeIcon icon={faArrowAltCircleRight} size="2x" className="position-absolute text-light" style={{ top: '50%', transform: 'translateY(-50%)', right: 0 }} /> */}

                                            <OwlCarousel ref="All Packages" options={{ responsive: { 0: { items: 1 } }, loop: false, dots: false }} events={{ onDragged: this.carouselChanged }}>
                                                {plans.map(({ price, name }) => <div key={name + ' ' + price}>
                                                    <Col xs={10} sm={9} className="text-center text-700 mx-auto text-x-large">
                                                        <div className="pb-2 mb-2 px-5 border-bottom border-border">
                                                            <FontAwesomeIcon fixedWidth icon={faMedal} />{name}
                                                        </div>
                                                        <div className="text-orange">$ {price} Limo</div>
                                                    </Col>
                                                </div>)}
                                            </OwlCarousel>
                                        </div>
                                    </Col>
                                    <div className="p-3 d-flex justify-content-between border-top border-border position-absolute w-100" style={{ bottom: 0 }}>
                                        <div>
                                            Purchased Times:
                                            <strong className="text-x-large text-montserrat ml-2">{periodPackages[plans[this.state.index].slug].length}</strong>
                                        </div>

                                        <div>
                                            Total Amount:
                                            <strong className="text-x-large text-montserrat ml-2">$ {periodPackages[plans[this.state.index].slug].reduce((acc, { amount }) => acc + amount, 0)}</strong>
                                        </div>
                                    </div>
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
                    <SpecialTitle user icon={faTachometerAlt}>Admin panel</SpecialTitle>
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
    onGetAdminDashboard: () => dispatch(actions.getAdminDashboard()),
    onResetDashboard: () => dispatch(actions.resetDashboard()),
    onPostAdminDeleteUser: id => dispatch(actions.postAdminDeleteUser(id)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
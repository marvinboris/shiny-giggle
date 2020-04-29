import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Col, Row, Spinner, Label, Input, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faWallet, faUserFriends, faEnvelope, faTicketAlt, faTasks, faArrowsAlt, faTimes, faMedal, faEye, faEdit, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleLeft, faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';

// Components
import BackEnd from '../../../BackEnd';

import Breadcrumb from '../../../../components/Backend/UI/Breadcrumb/Breadcrumb';
import SpecialTitle from '../../../../components/UI/Titles/SpecialTitle/SpecialTitle';
import Subtitle from '../../../../components/UI/Titles/Subtitle/Subtitle';
import Card from '../../../../components/Backend/Dashboard/Card/Card';
import Table from '../../../../components/Backend/UI/Table/Table';
import Error from '../../../../components/Error/Error';
import CustomSpinner from '../../../../components/UI/CustomSpinner/CustomSpinner';

import * as actions from '../../../../store/actions';
import { updateObject } from '../../../../shared/utility';

// Images
import FinanceTracker from '../../../../assets/images/Group 166@2x.png';

class Dashboard extends Component {
    state = {
        countries: []
    }

    async componentDidMount() {
        const { onGetAdminDashboard } = this.props;
        const cors = 'https://cors-anywhere.herokuapp.com/';

        const phoneRes = await fetch(cors + 'http://country.io/phone.json', { method: 'GET', mode: 'cors' });
        const namesRes = await fetch(cors + 'http://country.io/names.json', { method: 'GET', mode: 'cors' });

        const phone = await phoneRes.json();
        const names = await namesRes.json();

        const countries = Object.keys(phone).map(key => ({ country: key, code: phone[key], name: names[key] })).sort((a, b) => a.country > b.country);

        await this.setState({ countries });
        onGetAdminDashboard();
    }

    render() {
        let { backend: { dashboard: { loading, error, blocksData, totalUsers } } } = this.props;
        const { countries } = this.state;
        let content = null;
        let errors = null;

        const messages = [
            {
                received_date: new Date().getDate(),
                sender_name: 'John Mc Doe',
                object: 'Kindly send report...',
                content: 'Hello, you are invited...'
            },
            {
                received_date: new Date().getDate(),
                sender_name: 'Messila Marinera',
                object: 'Validate our meeting...',
                content: 'Checking operating...'
            },
            {
                received_date: new Date().getDate(),
                sender_name: 'John DOE',
                object: 'Call Client John Olie...',
                content: 'Good morning sir...'
            },
            {
                received_date: new Date().getDate(),
                sender_name: 'Mark Labilo',
                object: 'Schedule a meeting...',
                content: 'You are excepted to...'
            },
            {
                received_date: new Date().getDate(),
                sender_name: 'June de Jules',
                object: 'Make payment of...',
                content: 'Users are always...'
            },
        ];

        if (loading) content = <Col xs={12}>
            <CustomSpinner />
        </Col>;
        else {
            errors = <>
                <Error err={error} />
            </>;
            if (totalUsers && blocksData) {
                console.log({ countries })
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
                            <FontAwesomeIcon icon={faEye} className="text-lightblue mr-2" fixedWidth />
                            <FontAwesomeIcon icon={faEdit} className="text-green mr-2" fixedWidth />
                            <FontAwesomeIcon icon={faTrash} className="text-red" fixedWidth />
                        </div>
                    });
                });
                const messagesData = messages.map(message => updateObject(message, {
                    action: <div className="text-center">
                        <Button size="sm" color="orange" className="mr-2">
                            <FontAwesomeIcon icon={faEye} className="mr-2" fixedWidth />
                            View
                        </Button>

                        <Button size="sm" color="lightblue">
                            <FontAwesomeIcon icon={faReply} className="mr-2" fixedWidth />
                            Reply
                        </Button>
                    </div>
                }));

                content = (
                    <>
                        <Row>
                            {cards}
                            <Table
                                array={usersData} searchable draggable closable title="Total Users" dark icon={faTasks} bordered limit={5} lg={6} innerClassName="bg-darkblue" className="bg-darklight shadow-sm mt-5"
                                fields={[
                                    { name: 'First Name', key: 'first_name' },
                                    { name: 'Last Name', key: 'last_name' },
                                    { name: 'Username', key: 'username' },
                                    { name: 'Email', key: 'email' },
                                    { name: 'Country', key: 'country' },
                                    { name: 'Action', key: 'action' }
                                ]}>
                                <Link to="/admin/users" className="text-white">View full task list | ></Link>
                            </Table>

                            <Col lg={6} className="mt-5">
                                <div className="bg-darklight shadow-sm text-white h-100">
                                    <div className="p-3 border-bottom border-border text-orange text-700 position-relative d-flex">
                                        <span className="d-inline-flex align-items-center"><FontAwesomeIcon size="lg" className="mr-2" fixedWidth icon={faTasks} />Finance Tracker</span>

                                        <div className="ml-auto d-flex justify-content-end align-items-center text-white position-absolute" style={{ top: '50%', right: 16, transform: 'translateY(-50%)' }}>
                                            <FontAwesomeIcon icon={faArrowsAlt} size="lg" className="mr-3" />

                                            <FontAwesomeIcon icon={faTimes} size="2x" />
                                        </div>
                                    </div>

                                    <Row className="p-3">
                                        <Col xs={12} lg={11}>
                                            <img src={FinanceTracker} alt="Finance Tracker" className="img-fluid" />
                                        </Col>
                                    </Row>
                                </div>
                            </Col>

                            <Table
                                array={messagesData} searchable draggable closable title="Recent Messages" dark icon={faEnvelope} bordered limit={5} lg={8} innerClassName="bg-darkblue" className="bg-darklight shadow-sm mt-4"
                                fields={[
                                    { name: 'Received Date', key: 'received_date' },
                                    { name: 'Sender Name', key: 'sender_name' },
                                    { name: 'Object', key: 'object' },
                                    { name: 'Content', key: 'content' },
                                    { name: 'Action', key: 'action' }
                                ]}>
                                <Link to="/admin/messages" className="text-white">View full list | ></Link>
                            </Table>

                            <Col lg={4} className="mt-4">
                                <div className="bg-darklight shadow-sm h-100 text-white position-relative d-flex flex-column">
                                    <div className="p-3 border-bottom border-border text-orange text-700 position-relative d-flex">
                                        <span className="d-inline-flex align-items-center"><FontAwesomeIcon size="lg" className="mr-2" fixedWidth icon={faTasks} />All Packages</span>
                                    </div>
                                    <Col xs={12} className="py-3 d-flex flex-column px-3 flex-fill pb-5">
                                        <div className="d-flex justify-content-around mb-3">
                                            <Label check>
                                                <Input type="radio" name="radio1" />{' '}
                                                Today
                                            </Label>

                                            <Label check>
                                                <Input type="radio" name="radio1" />{' '}
                                                Weekly
                                            </Label>

                                            <Label check>
                                                <Input type="radio" name="radio1" />{' '}
                                                Monthly
                                            </Label>

                                            <Label check>
                                                <Input type="radio" name="radio1" />{' '}
                                                Yearly
                                            </Label>
                                        </div>

                                        <div className="d-flex justify-content-center align-items-center flex-fill position-relative">
                                            <FontAwesomeIcon icon={faArrowAltCircleLeft} size="2x" className="position-absolute text-light" style={{ top: '50%', transform: 'translateY(-50%)', left: 0 }} />
                                            <FontAwesomeIcon icon={faArrowAltCircleRight} size="2x" className="position-absolute text-light" style={{ top: '50%', transform: 'translateY(-50%)', right: 0 }} />

                                            <strong className="text-center text-x-large">
                                                <div className="pb-2 mb-2 px-5 border-bottom border-border">
                                                    <FontAwesomeIcon fixedWidth icon={faMedal} />

                                                    Silver Plan
                                                </div>

                                                <div className="text-orange">
                                                    $ 5 Limo
                                                </div>
                                            </strong>
                                        </div>
                                    </Col>
                                    <div className="p-3 d-flex justify-content-between border-top border-border position-absolute w-100" style={{ bottom: 0 }}>
                                        <div className="d-flex align-items-center">
                                            Purchased Times:
                                            <strong className="text-x-large text-montserrat ml-2">120</strong>
                                        </div>

                                        <div className="d-flex align-items-center">
                                            Total Amount:
                                            <strong className="text-x-large text-montserrat ml-2">$ 600</strong>
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
            <BackEnd>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main="Dashboard" icon={faTachometerAlt} />
                    <SpecialTitle user icon={faTachometerAlt}>Admin panel</SpecialTitle>
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
    onGetAdminDashboard: () => dispatch(actions.getAdminDashboard())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
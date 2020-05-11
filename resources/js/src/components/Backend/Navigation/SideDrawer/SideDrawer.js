import React from 'react';
import { Col, Badge, ButtonGroup, Button, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUserTie, faCalendarAlt, faEnvelope, faTasks, faCog, faCircle, faEdit, faMoneyBillWave, faWallet, faCopy, faBell } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import SideDrawerItem from './SideDrawerItem/SideDrawerItem';
import './SideDrawer.css';

const roles = {
    user: 'System User',
    admin: 'Administrator'
};

export default ({ name, photo = "https://placehold.it/100x100", role = '', credits = 0, id, sponsor, toggle, isOpen }) => {
    let addOns = null;
    let sideDrawerItems = null;
    switch (role) {
        case 'user':
            addOns = <>
                <ButtonGroup className="shadow-sm text-small mb-3">
                    <div className="rounded-left-2 py-1 pl-2 pr-3 border-right border-white bg-orange text-white">
                        <FontAwesomeIcon icon={faWallet} className="text-black mr-1" fixedWidth />
                        Credits
                    </div>

                    <div className="rounded-right-2 py-1 pr-2 pl-3 border-0 text-700 bg-orange text-white position-relative">
                        ${credits}

                        <div className="position-absolute border border-2 border-green rounded-circle bg-white" style={{ top: '50%', left: 0, width: 10, height: 10, transform: 'translate(-50%, -50%)' }} />
                    </div>
                </ButtonGroup>

                <Col xs={12} className="p-0 text-orange text-300 small">
                    <FontAwesomeIcon fixedWidth icon={faUserTie} size="sm" className="mr-1" />Account ID: <span className="text-700">{id}</span> <CopyToClipboard text={id}>
                        <FontAwesomeIcon fixedWidth icon={faCopy} className="ml-1 text-lightblue" style={{ cursor: 'pointer' }} />
                    </CopyToClipboard>
                </Col>
            </>;
            sideDrawerItems = <>
                <SideDrawerItem sideDrawerToggle={toggle} icon={faUserTie} dropdown path="/user/subscription" items={[
                    { link: '/user/subscription/buy', text: 'Buy Plan' },
                    { link: '/user/subscription/plans', text: 'My Plans' },
                ]}>Subscription Plan</SideDrawerItem>
                <SideDrawerItem sideDrawerToggle={toggle} icon={faCalendarAlt} href="/user/calculate">Calculate</SideDrawerItem>
                {/* <SideDrawerItem sideDrawerToggle={toggle} icon={faMoneyBillWave} dropdown path="/user/finances" items={[
                    { link: '/user/finances/deposits/add', text: 'Deposit Credits' },
                    { link: '/user/finances/deposits/', text: 'Deposit List' },
                ]}>Finances</SideDrawerItem> */}
                <SideDrawerItem sideDrawerToggle={toggle} icon={faEnvelope} href="/user/contact-us/add">Contact us<Badge color="green" className="position-relative rounded-circle text-x-small text-700 d-inline-flex justify-content-center align-items-center" style={{ width: 18, height: 18, top: -7, transform: 'translateX(-40px)' }}><b className="text-white">12</b></Badge></SideDrawerItem>
                <SideDrawerItem sideDrawerToggle={toggle} icon={faCog} dropdown path="/user/options" items={[
                    { link: '/user/options/terms-conditions', text: 'Terms & Conditions' },
                    { link: '/user/options/auto-reinvest', text: 'Auto Reinvest (Coming soon)' },
                    { link: '/user/options/sms-notification', text: 'SMS Notification (Coming soon)' },
                ]}>Options</SideDrawerItem>
            </>;
            break;

        case 'admin':
            sideDrawerItems = <>
                <SideDrawerItem sideDrawerToggle={toggle} icon={faUserTie} dropdown path="/admin/finances" items={[
                    { link: '/admin/finances/sales-report', text: 'Sales Report' },
                    { link: '/admin/finances/limo-payments', text: 'Limo Payments' },
                    { link: '/admin/finances/credits/add', text: 'Add Credit' },
                    { link: '/admin/finances/credits', text: 'Credit List' },
                ]}>Finances</SideDrawerItem>
                <SideDrawerItem sideDrawerToggle={toggle} icon={faCalendarAlt} dropdown path="/admin/users" items={[
                    { link: '/admin/users/add', text: 'Add User' },
                    { link: '/admin/users', text: 'User List' },
                ]}>Users</SideDrawerItem>
                <SideDrawerItem sideDrawerToggle={toggle} icon={faEnvelope} href="/following">Contact us<Badge color="green" className="position-relative rounded-circle text-x-small text-700 d-inline-flex justify-content-center align-items-center" style={{ width: 18, height: 18, top: -7, transform: 'translateX(-40px)' }}><b className="text-white">12</b></Badge></SideDrawerItem>
                <SideDrawerItem sideDrawerToggle={toggle} icon={faTasks} dropdown path="/admin/plans" items={[
                    { link: '/admin/plans/add', text: 'Add Plan' },
                    { link: '/admin/plans', text: 'Plan List' },
                    { link: '/admin/plans/deposit', text: 'Plan Deposit' },
                ]}>Subscription Plan</SideDrawerItem>
            </>;
            break;

        default:
            break;
    }

    return (
        <Collapse isOpen={isOpen} className="SideDrawer nav-left-sidebar bg-darklight border-right border-darkblue text-white position-fixed d-md-block" style={{ width: 280 }}>
            <div className="menu-list">
                <Col xs={12}>
                    <div className="py-3 align-items-center border-top border-bottom border-white-20">
                        <Col xs={12} className="px-2 position-relative d-flex justify-content-center">
                            <div className="border-3 border-orange d-flex justify-content-center align-items-center border rounded-circle" style={{ width: 84, height: 84 }}>
                                <img src={photo} className="rounded-circle" style={{ width: 64, height: 64, objectFit: 'cover', objectPosition: 'center' }} alt="User profile" />
                            </div>

                            <FontAwesomeIcon icon={faEdit} className="position-absolute text-orange" size="2x" style={{ top: 0, right: 0 }} />
                        </Col>
                        <Col xs={12} className="p-0 h-100">
                            <div className="align-items-center text-center m-0 h-100">
                                <Col xs={12} className="p-0 text-large mb-3">
                                    <strong>{name}</strong>

                                    <div className="d-flex justify-content-center position-relative">
                                        <div className="border-bottom border-border" style={{ width: 100 }} />

                                        <div className="bg-orange border rounded-circle border-white position-absolute" style={{ width: 10, height: 10, bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' }} />
                                    </div>
                                </Col>
                                {addOns}
                                <Col xs={12} className="p-0 text-green text-300 small">
                                    <FontAwesomeIcon fixedWidth icon={faCheckCircle} size="sm" className="mr-1" />{roles[role]}
                                </Col>
                            </div>
                        </Col>
                    </div>
                </Col>
                <nav className="navbar navbar-expand navbar-dark py-0 px-0 mt-5">
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav w-100 flex-column">
                            <SideDrawerItem sideDrawerToggle={toggle} icon={faTachometerAlt} href="/dashboard">Dashboard</SideDrawerItem>
                            {sideDrawerItems}
                            <SideDrawerItem sideDrawerToggle={toggle} icon={faBell} exact={false} href="/notifications">Notifications</SideDrawerItem>
                        </ul>
                    </div>
                </nav>
            </div>
            <div className="backdrop w-100 bg-darkblue-50 position-fixed d-md-none" onClick={toggle} style={{ top: 101, zIndex: -1 }} />
        </Collapse>
    )
};
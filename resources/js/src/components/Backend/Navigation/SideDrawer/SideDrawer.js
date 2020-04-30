import React from 'react';
import { Col, Badge, ButtonGroup, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUserTie, faCalendarAlt, faEnvelope, faTasks, faCog, faCircle, faEdit, faMoneyBillWave, faWallet } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';

import SideDrawerItem from './SideDrawerItem/SideDrawerItem';
import './SideDrawer.css';

const roles = {
    user: 'System User',
    admin: 'Administrator'
};

const sideDrawer = ({ name, photo = "https://placehold.it/100x100", role = '', credits = 0, id, sponsor }) => {
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
                    <FontAwesomeIcon fixedWidth icon={faUserTie} size="sm" className="mr-1" />Account ID: <span className="text-700">{id}</span>
                </Col>
            </>;
            sideDrawerItems = <>
                <SideDrawerItem icon={faUserTie} dropdown path="/user/subscription" items={[
                    { link: '/user/subscription/buy', text: 'Buy Plan' },
                    { link: '/user/subscription/plans', text: 'My Plans' },
                ]}>Subscription Plan</SideDrawerItem>
                <SideDrawerItem icon={faCalendarAlt} href="/user/calculate">Calculate</SideDrawerItem>
                <SideDrawerItem icon={faMoneyBillWave} dropdown path="/user/finances" items={[
                    { link: '/user/finances/deposits/add', text: 'Deposit Credits' },
                    { link: '/user/finances/deposits/', text: 'Deposit List' },
                ]}>Finances</SideDrawerItem>
                <SideDrawerItem icon={faCog} dropdown path="/user/options" items={[
                    { link: '/user/options/terms-conditions', text: 'Terms & Conditions' },
                    { link: '/user/options/auto-reinvest', text: 'Auto Reinvest' },
                    { link: '/user/options/sms-notification', text: 'SMS Notification' },
                ]}>Options</SideDrawerItem>
            </>;
            break;

        case 'admin':
            sideDrawerItems = <>
                <SideDrawerItem icon={faUserTie} dropdown path="/admin/finances" items={[
                    { link: '/admin/finances/service', text: 'Sales Report' },
                    { link: '/admin/finances/points/deposit', text: 'Deposit Points' },
                    { link: '/admin/finances/points', text: 'Deposit Points List' },
                ]}>Finances</SideDrawerItem>
                <SideDrawerItem icon={faCalendarAlt} dropdown path="/admin/users" items={[
                    { link: '/admin/users/add', text: 'Add User' },
                    { link: '/admin/users', text: 'User List' },
                ]}>Users</SideDrawerItem>
                <SideDrawerItem icon={faEnvelope} href="/following">Contact us<Badge color="green" className="position-relative rounded-circle text-x-small text-700 d-inline-flex justify-content-center align-items-center" style={{ width: 18, height: 18, top: -7, transform: 'translateX(-40px)' }}>12</Badge></SideDrawerItem>
                <SideDrawerItem icon={faTasks} dropdown path="/packages" items={[]}>Packages</SideDrawerItem>
            </>;
            break;

        default:
            break;
    }

    return (
        <div className="SideDrawer nav-left-sidebar bg-darklight border-right border-darkblue text-white" style={{ width: 280, position: 'fixed', top: 101, zIndex: 1100, height: 'calc(100vh - 101px)' }}>
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
                            <SideDrawerItem icon={faTachometerAlt} href="/dashboard">Dashboard</SideDrawerItem>
                            {sideDrawerItems}
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
    )
};

export default sideDrawer;
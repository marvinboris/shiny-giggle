import React from 'react';
import { Col, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUserTie, faCalendarAlt, faEnvelope, faTasks, faCog, faCircle, faEdit } from '@fortawesome/free-solid-svg-icons';

import SideDrawerItem from './SideDrawerItem/SideDrawerItem';
import './SideDrawer.css';

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

const sideDrawer = ({ name, photo = "https://placehold.it/100x100", role = '' }) => {
    let sideDrawerItems = null;
    switch (role) {
        case 'user':
            sideDrawerItems = <>
                <SideDrawerItem icon={faUserTie} dropdown path="/user/subscription" items={[
                    { link: '/user/subscription/buy', text: 'Buy Plan' },
                    { link: '/user/subscription/plans', text: 'My Plans' },
                ]}>Subscription Plan</SideDrawerItem>
                <SideDrawerItem icon={faCalendarAlt} href="/user/calculate">Calculate</SideDrawerItem>
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
                                        <div className="border-bottom border-white" style={{ width: 100 }} />

                                        <div className="bg-orange border rounded-circle border-white position-absolute" style={{ width: 10, height: 10, bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' }} />
                                    </div>
                                </Col>
                                <Col xs={12} className="p-0 text-success small">
                                    <FontAwesomeIcon fixedWidth icon={faCircle} size="sm" className="mr-1" />{capitalize(role)}
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
                            <SideDrawerItem icon={faEnvelope} href="/following">Contact us<Badge color="green" className="position-relative rounded-circle text-x-small text-700 d-inline-flex justify-content-center align-items-center" style={{ width: 18, height: 18, top: -7, transform: 'translateX(-40px)' }}>12</Badge></SideDrawerItem>
                            <SideDrawerItem icon={faTasks} dropdown path="/packages" items={[]}>Packages</SideDrawerItem>
                            <SideDrawerItem icon={faCog} dropdown path="/settings" items={[
                                { link: '/settings/change-password', text: 'Change Password' },
                                { link: '/settings/profile', text: 'Profile' },
                            ]}>Settings</SideDrawerItem>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
    )
};

export default sideDrawer;
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import NavigationItems from '../NavigationItems/NavigationItems';
import AdminLogo from '../../../UI/NewLogo/NewLogo';

const Toolbar = ({ name, logoutHandler, cartItemsNumber, role, logoWidth = 280, notifications, messages, date, clock, toggle }) => (
    <>
        <nav className="navbar navbar-expand-lg sticky-top bg-darklight p-0">
            <Link to="/" className="navbar-brand text-center d-none d-md-flex justify-content-center align-items-center p-0 m-0 align-middle" style={{ width: logoWidth, height: 101 }}><AdminLogo /></Link>
            <NavigationItems name={name} logoutHandler={logoutHandler} notifications={notifications} messages={messages} cartItemsNumber={cartItemsNumber} role={role} clock={clock} date={date} sidedrawerToggle={toggle} />
        </nav>
    </>
);

export default Toolbar;
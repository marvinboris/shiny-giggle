import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import NavigationItems from '../NavigationItems/NavigationItems';
import AdminLogo from '../../../UI/NewLogo/NewLogo';

const Toolbar = ({ name, logoutHandler, cartItemsNumber, role, logoWidth = 280, notifications, date, clock, clickHandler }) => (
    <>
        <nav className="navbar navbar-expand-lg sticky-top bg-darklight p-0">
            <Link to="/" className="navbar-brand text-center d-flex justify-content-center align-items-center p-0 m-0 align-middle" style={{ width: logoWidth, height: 101 }}><AdminLogo /></Link>
            <Button className="navbar-toggler">
                <span className="navbar-toggler-icon"></span>
            </Button>
            <NavigationItems name={name} logoutHandler={logoutHandler} notifications={notifications} cartItemsNumber={cartItemsNumber} role={role} clock={clock} date={date} clickHandler={clickHandler} />
        </nav>
    </>
);

export default Toolbar;
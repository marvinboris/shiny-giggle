import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Toolbar.css';
import NavigationItems from '../NavigationItems/NavigationItems';

const toolbar = ({ isAuth, name, drawerToggleClicked, logoutHandler, role, cartItemsNumber, notifications }) => (
    <>
        <div className="container-fluid bg-dark text-light py-1 d-none d-md-block" style={{ fontSize: ".8rem" }}>
            <div className="container d-flex justify-content-between">
                <div className="text-left d-flex justify-content-start align-items-center">
                    <div className="d-flex align-items-center px-2 py-1"><FontAwesomeIcon icon="phone" className="mr-1" />(+237) 656-39-52-17</div>
                    <div className="d-flex align-items-center px-2 py-1"><a href="mailto:ulrichnatsou@gmail.com" className="text-light"><FontAwesomeIcon icon="envelope" className="mr-1" />ulrichnatsou@gmail.com</a></div>
                    <div className="d-flex align-items-center px-2 py-1"><a className="text-light" href="/"><FontAwesomeIcon size="lg" icon={["fab" , "youtube"]} /></a></div>
                    <div className="d-flex align-items-center px-2 py-1"><a className="text-light" href="/"><FontAwesomeIcon size="lg" icon={["fab" , "linkedin"]} /></a></div>
                    <div className="d-flex align-items-center px-2 py-1"><a className="text-light" href="/"><FontAwesomeIcon size="lg" icon={["fab" , "twitter"]} /></a></div>
                    <div className="d-flex align-items-center px-2 py-1"><a className="text-light" href="/"><FontAwesomeIcon size="lg" icon={["fab" , "instagram"]} /></a></div>
                </div>
            </div>
        </div>
        <NavigationItems isAuth={isAuth} name={name} logoutHandler={logoutHandler} notifications={notifications} cartItemsNumber={cartItemsNumber} role={role} />
    </>
);

export default toolbar;
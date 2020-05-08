import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Collapse, Nav, UncontrolledDropdown, DropdownToggle, Badge, DropdownMenu, DropdownItem, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBell, faBars, faCalendar, faPowerOff, faEnvelope, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faClock, faComments } from '@fortawesome/free-regular-svg-icons';

// import NavigationItem from './NavigationItem/NavigationItem';
// import MyDropdownItem from '../../../Navigation/NavigationItems/DropdownItem/DropdownItem';

export default ({ cartItemsNumber, name, sidedrawerToggle, logoutHandler, role, notifications, clickHandler, date: { weekDay, day, month, year }, clock: { hours, minutes, seconds } }) => {
    if (!notifications) notifications = [];
    const notificationItems = notifications.map(notification => {
        let message;
        switch (notification.type) {
            case 'Product':
                message = <NavLink to={"/communities/" + notification.userId._id} className="text-reset text-truncate small"><FontAwesomeIcon className="text-success mr-1" size="lg" fixedWidth icon={faShoppingCart} />Nouveau produit dans la boutique {notification.userId.community.name}</NavLink>;
                break;

            default:
                break;
        }

        return <DropdownItem key={notification._id} className="text-dark border-top">
            {message}
        </DropdownItem>
    });

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    return <div className="px-3 bg-darkblue flex-fill d-flex align-items-center text-light text-large" style={{ height: 101 }}>
        <Nav className="mr-auto d-flex align-items-center" navbar>
            <FontAwesomeIcon icon={faBars} className="mr-3 mr-md-5 ml-2 ml-md-4" style={{ cursor: 'pointer' }} onClick={sidedrawerToggle} size="2x" />
            <div className="mr-4 d-none d-md-block">
                <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                <span className="text-300">Today is</span> <strong>{weekDay} {day} {month} {year}</strong>
            </div>
            <div className="d-none d-md-block">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                <strong>TIME : {hours} : {minutes} : {seconds}</strong>
            </div>
        </Nav>
        <div className="ml-auto d-flex align-items-center">
            <div className="py-3 d-flex justify-content-between align-items-center">
                <div className="pr-5">{role === 'user' ? <Button onClick={clickHandler} size="lg" className="rounded-2 d-none d-md-inline px-4" color="orange">Calculate Now</Button> : null}</div>

                <UncontrolledDropdown inNavbar>
                    <DropdownToggle nav className="p-0">
                        <FontAwesomeIcon icon={faComments} className="text-light mr-3" size="lg" />
                        <Badge color="pink" className="position-absolute rounded-circle d-inline-flex justify-content-center align-items-center" style={{ width: 20, height: 20, transform: 'translate(-30px, -5px)', zIndex: 2 }}>{notifications.length || 4}</Badge>
                    </DropdownToggle>
                    <DropdownMenu right>
                        {notifications.length === 0 ? <DropdownItem disabled className="bg-dark text-white">
                            <p>Aucune notification.</p>
                        </DropdownItem> : <>
                                <DropdownItem disabled className="text-left pt-0 small">
                                    Vous avez {notifications.length || 4} notifications.
                                        </DropdownItem>
                                {notificationItems}
                                <DropdownItem className="text-center pb-0 border-top">
                                    <NavLink className="text-reset small" to="/notifications">Toutes les notifications</NavLink>
                                </DropdownItem>
                            </>}
                    </DropdownMenu>
                </UncontrolledDropdown>

                <UncontrolledDropdown inNavbar>
                    <DropdownToggle nav className="p-0">
                        <FontAwesomeIcon icon={faEnvelope} className="text-light mr-3" size="lg" />
                        <Badge color="green" className="position-absolute rounded-circle d-inline-flex justify-content-center align-items-center" style={{ width: 20, height: 20, transform: 'translate(-30px, -5px)', zIndex: 2 }}>{notifications.length || 6}</Badge>
                    </DropdownToggle>
                    <DropdownMenu right>
                        {notifications.length === 0 ? <DropdownItem disabled className="bg-dark text-white">
                            <p>Aucune notification.</p>
                        </DropdownItem> : <>
                                <DropdownItem disabled className="text-left pt-0 small">
                                    Vous avez {notifications.length || 6} notifications.
                                        </DropdownItem>
                                {notificationItems}
                                <DropdownItem className="text-center pb-0 border-top">
                                    <NavLink className="text-reset small" to="/notifications">Toutes les notifications</NavLink>
                                </DropdownItem>
                            </>}
                    </DropdownMenu>
                </UncontrolledDropdown>

                <UncontrolledDropdown inNavbar>
                    <DropdownToggle nav className="p-0">
                        <FontAwesomeIcon icon={faBell} className="text-light mr-3" size="lg" />
                        <Badge color="yellow" className="position-absolute rounded-circle d-inline-flex justify-content-center align-items-center" style={{ width: 20, height: 20, transform: 'translate(-30px, -5px)', zIndex: 2 }}>{notifications.length || 9}</Badge>
                    </DropdownToggle>
                    <DropdownMenu right>
                        {notifications.length === 0 ? <DropdownItem disabled className="bg-dark text-white">
                            <p>Aucune notification.</p>
                        </DropdownItem> : <>
                                <DropdownItem disabled className="text-left pt-0 small">
                                    Vous avez {notifications.length || 9} notifications.
                                        </DropdownItem>
                                {notificationItems}
                                <DropdownItem className="text-center pb-0 border-top">
                                    <NavLink className="text-reset small" to="/notifications">Toutes les notifications</NavLink>
                                </DropdownItem>
                            </>}
                    </DropdownMenu>
                </UncontrolledDropdown>
            </div>
            <div onClick={toggle} style={{ cursor: 'pointer' }} className="d-flex align-items-center ml-md-5">
                <span className="d-none d-md-inline">Sign out</span>
                <FontAwesomeIcon icon={faPowerOff} size="lg" className="ml-2" />
            </div>
        </div>

        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Logout</ModalHeader>
            <ModalBody className="text-center">
                <p>Are you sure you want to logout?</p>
                <div>
                    <Button color="lightblue" onClick={logoutHandler}>Logout <FontAwesomeIcon icon={faPowerOff} fixedWidth /></Button>{' '}
                    <Button color="orange" onClick={toggle}>Close <FontAwesomeIcon icon={faTimes} fixedWidth /></Button>
                </div>
            </ModalBody>
        </Modal>
    </div>;
}
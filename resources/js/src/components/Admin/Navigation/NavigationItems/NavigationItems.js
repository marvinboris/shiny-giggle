import React from 'react';
import { NavLink } from 'react-router-dom';
import { Collapse, Nav, UncontrolledDropdown, DropdownToggle, Badge, DropdownMenu, DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBell, faBars, faCalendar, faPowerOff, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faClock, faComments } from '@fortawesome/free-regular-svg-icons';

// import NavigationItem from './NavigationItem/NavigationItem';
// import MyDropdownItem from '../../../Navigation/NavigationItems/DropdownItem/DropdownItem';

const navigationItems = ({ cartItemsNumber, name, logoutHandler, role, notifications }) => {
    const date = new Date();

    const weekDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][date.getDay()];
    const day = date.getDate();
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

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

    return (
        <>
            <Collapse navbar className="px-3 bg-darkblue text-light text-large" style={{ height: 56 }}>
                <Nav className="mr-auto d-flex align-items-center" navbar>
                    <FontAwesomeIcon icon={faBars} className="mr-5 ml-4" size="2x" />
                    <div className="mr-4">
                        <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                        <span className="text-300">Today is</span> <strong>{weekDay} {day} {month} {year}</strong>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faClock} className="mr-2" />
                        <strong>TIME : {hours} : {minutes} : {seconds}</strong>
                    </div>
                </Nav>
                <Nav className="ml-auto d-flex align-items-center" navbar>
                    <div className="py-3 d-flex justify-content-between align-items-center">
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav className="p-0">
                                <FontAwesomeIcon icon={faComments} className="text-light" size="1x" />
                                <Badge color="pink" className="position-relative rounded-circle d-inline-flex justify-content-center align-items-center" style={{ top: '-10px', left: '-8px', width: 20, height: 20 }}>{notifications.length || 4}</Badge>
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

                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav className="p-0">
                                <FontAwesomeIcon icon={faEnvelope} className="text-light" size="1x" />
                                <Badge color="green" className="position-relative rounded-circle d-inline-flex justify-content-center align-items-center" style={{ top: '-10px', left: '-8px', width: 20, height: 20 }}>{notifications.length || 6}</Badge>
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

                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav className="p-0">
                                <FontAwesomeIcon icon={faBell} className="text-light" size="1x" />
                                <Badge color="yellow" className="position-relative rounded-circle d-inline-flex justify-content-center align-items-center" style={{ top: '-10px', left: '-8px', width: 20, height: 20 }}>{notifications.length || 9}</Badge>
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
                    <div className="d-flex align-items-center ml-5">
                        Sign out
                        <FontAwesomeIcon icon={faPowerOff} size="lg" className="ml-2" />
                    </div>
                </Nav>
            </Collapse>
        </>
    );
}

export default navigationItems;
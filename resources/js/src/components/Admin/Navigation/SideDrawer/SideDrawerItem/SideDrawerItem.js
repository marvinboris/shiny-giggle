import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './SideDrawerItem.scss';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Collapse, Button } from 'reactstrap';

const SideDrawerItem = ({ children, dropdown, icon, href, items }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    let content;
    if (!dropdown) content =
        <NavLink exact className="SideDrawerItem nav-link row pl-3 text-large text-300 text-light" activeClassName="active bg-darkblue py-3" to={href}>
            <FontAwesomeIcon fixedWidth icon={icon} className="mr-3" /> <span>{children}</span>
        </NavLink>;
    else {
        const itemEls = items.map(({ link, text }) => (
            <li className="nav-item text-300" key={text}>
                <NavLink exact className="nav-link" to={link}><span className="position-relative" style={{ left: -8 }}>-</span> {text}</NavLink>
            </li>
        ));

        content = (
            <div>
                <Button color="link" block onClick={toggle} className="SideDrawerItem px-0 nav-link row pl-3 text-large text-300 text-left text-light position-relative">
                    <FontAwesomeIcon fixedWidth icon={icon} className="mr-3" />
                    <span>{children}</span>
                    <FontAwesomeIcon fixedWidth icon={faAngleDown} className={`position-absolute angle-down ${isOpen ? 'open' : ''}`}  style={{ right: -16, top: '50%' }} />
                </Button>
                <Collapse isOpen={isOpen} className="row pl-3 bg-darkblue-20">
                    <ul className="nav flex-column border-left ml-3 border-white-20">
                        {itemEls}
                    </ul>
                </Collapse>
            </div>
        );
    }

    return (
        <li className="nav-item">{content}</li>
    );
};

export default SideDrawerItem;
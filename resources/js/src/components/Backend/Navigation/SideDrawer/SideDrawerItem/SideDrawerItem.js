import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Collapse, Button } from 'reactstrap';

import './SideDrawerItem.css';

const SideDrawerItem = ({ children, dropdown, icon, href = '', items, path = '', sideDrawerToggle, exact = true, select, selected, id }) => {
    const match = window.location.pathname.includes(path);

    const toggle = () => {
        const match = selected === id;
        match ? select(null) : select(id);
    }

    const onSelect = () => toggle();

    const onSideDrawerToggle = () => {
        sideDrawerToggle();
        toggle();
    }

    let isSelected = selected === id;
    if (selected === '') isSelected = match;

    let content;
    if (!dropdown) content = <>
        <NavLink onClick={onSideDrawerToggle} exact={exact} className="SideDrawerItem d-sm-none nav-link pl-3 text-large text-300 text-light" activeClassName="active bg-darkblue py-3" to={href}>
            <FontAwesomeIcon fixedWidth icon={icon} className="mr-3" /> <span>{children}</span>
        </NavLink>
        <NavLink onClick={onSelect} exact={exact} className="SideDrawerItem nav-link d-none d-sm-block pl-3 text-large text-300 text-light" activeClassName="active bg-darkblue py-3" to={href}>
            <FontAwesomeIcon fixedWidth icon={icon} className="mr-3" /> <span>{children}</span>
        </NavLink>
    </>;
    else {
        const itemEls = items.map(({ link = '', text }) => (
            <li className="nav-item text-300" key={text}>
                <NavLink onClick={sideDrawerToggle} exact className="nav-link d-sm-none" to={link}><span className="position-relative" style={{ left: -8 }}>-</span> {text}</NavLink>
                <NavLink exact className="nav-link d-none d-sm-block" to={link}><span className="position-relative" style={{ left: -8 }}>-</span> {text}</NavLink>
            </li>
        ));

        content = (
            <div>
                <Button color="link" onClick={onSelect} className={`SideDrawerItem nav-link d-block w-100 pl-3 text-large text-300 rounded-0 text-left text-light position-relative ${match ? 'active bg-darkblue py-3' : ''}`} style={match ? { paddingRight: 60 } : {}}>
                    <FontAwesomeIcon fixedWidth icon={icon} className="mr-3" />
                    <span>{children}</span>
                    <FontAwesomeIcon fixedWidth icon={faAngleDown} className={`position-absolute angle-down ${isSelected ? 'open' : ''}`} style={{ right: 16, top: '50%' }} />
                </Button>
                <Collapse isOpen={isSelected} className="pl-3 bg-darkblue-20">
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
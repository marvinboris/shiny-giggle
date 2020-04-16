import React from 'react';
import { Navbar } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

import Logo from '../../assets/images/Group 118@2x.png';

export default ({ isAuthenticated, logout }) => <div>
    <Navbar className="border-bottom bg-darkblue border-yellow d-flex align-items-center px-5" light expand="md">
        <NavLink to="/">
            <img src={Logo} width={341} alt="Logo" />
        </NavLink>

        {isAuthenticated ? <FontAwesomeIcon onClick={logout} className="text-white ml-auto" style={{ cursor: 'pointer' }} size="3x" icon={faPowerOff} /> : null}
    </Navbar>
</div>;
import React from 'react';
import { Navbar } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

import Logo from '../../assets/images/Group 118@2x.png';

export default ({ isAuthenticated, role, logout, dashboard }) => <div>
    <Navbar className="border-bottom bg-darkblue border-yellow d-flex align-items-center px-5" light expand="md">
        <NavLink to="/">
            <img src={Logo} width={341} alt="Logo" />
        </NavLink>

        {isAuthenticated ? <div className="d-flex align-items-center justify-content-end ml-auto">
            {role === 'guest' ? null : <FontAwesomeIcon onClick={dashboard} className="text-white" style={{ cursor: 'pointer' }} size="3x" icon={faTachometerAlt} />}

            <FontAwesomeIcon onClick={logout} className="text-white ml-3" style={{ cursor: 'pointer' }} size="3x" icon={faPowerOff} />
        </div> : null}
    </Navbar>
</div>;
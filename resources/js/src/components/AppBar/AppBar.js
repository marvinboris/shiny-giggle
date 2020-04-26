import React, { useState } from 'react';
import { Navbar, Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff, faTachometerAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import Logo from '../../assets/images/Group 118@2x.png';

export default ({ isAuthenticated, role, logout, dashboard }) => {
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    return <div>
        <Navbar className="border-bottom bg-darkblue border-yellow d-flex align-items-center px-5" light expand="md">
            <Link to="/">
                <img src={Logo} width={341} alt="Logo" />
            </Link>

            {isAuthenticated ? <div className="d-flex align-items-center justify-content-end ml-auto">
                {role === 'guest' ? null : <FontAwesomeIcon onClick={dashboard} className="text-white" style={{ cursor: 'pointer' }} size="3x" icon={faTachometerAlt} />}

                <FontAwesomeIcon onClick={toggle} className="text-white ml-3" style={{ cursor: 'pointer' }} size="3x" icon={faPowerOff} />
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>Logout</ModalHeader>
                    <ModalBody className="text-center">
                        <p>Are you sure you want to logout?</p>
                        <div>
                            <Button color="lightblue" onClick={logout}>Logout <FontAwesomeIcon icon={faPowerOff} fixedWidth /></Button>{' '}
                            <Button color="orange" onClick={toggle}>Close <FontAwesomeIcon icon={faTimes} fixedWidth /></Button>
                        </div>
                    </ModalBody>
                </Modal>
            </div> : null}
        </Navbar>
    </div>;
}
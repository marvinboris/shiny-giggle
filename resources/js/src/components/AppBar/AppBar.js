import React, { useState } from 'react';
import { Navbar, Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff, faTachometerAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import Logo from '../../assets/images/logo-header.png';

export default ({ isAuthenticated, role, logout, dashboard }) => {
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    return <div className="AppBar">
        <div className="d-none d-sm-block">
            <Navbar className="border-bottom bg-darkblue border-yellow-50 d-flex align-items-center px-5" light expand="md">
                <Link to="/" style={{ transform: 'scale(.7)', transformOrigin: 'center' }}>
                    <img src={Logo} width={341} alt="Logo" />
                </Link>

                {isAuthenticated ? <div className="d-flex align-items-center justify-content-end ml-auto">
                    {/* {role === 'guest' ? null : <FontAwesomeIcon onClick={dashboard} className="text-white" style={{ cursor: 'pointer' }} size="3x" icon={faTachometerAlt} />}

                    <FontAwesomeIcon onClick={toggle} className="text-white ml-3" style={{ cursor: 'pointer' }} size="3x" icon={faPowerOff} /> */}
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
        </div>

        <div className="d-sm-none fixed-top w-100">
            {isAuthenticated ? <div className="d-flex align-items-center justify-content-end p-3">
                {/* {role === 'guest' ? null : <FontAwesomeIcon onClick={dashboard} className="text-white" style={{ cursor: 'pointer' }} size="2x" icon={faTachometerAlt} />}

                <FontAwesomeIcon onClick={toggle} className="text-white ml-3" style={{ cursor: 'pointer' }} size="2x" icon={faPowerOff} /> */}
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
        </div>
    </div>;
}
import React from 'react';
import { Row, Col } from 'reactstrap';
import { NavLink } from 'react-router-dom';

import FrontEnd from '../../FrontEnd';

import Title from '../../../components/UI/Title/Title';

import manMoney from '../../../assets/images/Group 24@2x.png';

const ActiveLink = ({ link, children }) => <div className="text-white position-relative h4"><NavLink className="text-decoration-none text-white" to={"/auth/" + link}>{children}</NavLink></div>;
const InactiveLink = ({ link, children }) => <div className="m-0 h6"><NavLink className="text-decoration-none text-gray" to={"/auth/" + link}>{children}</NavLink></div>;

export default ({ getIn, signUp, guest, code, children }) => <FrontEnd>
    <Title>Want to know what you will gain while investing in Liyeplimal ?</Title>

    <Row className="justify-content-between flex-fill align-items-center">
        <Col xl={6} lg={7} md={8} sm={9} xs={12} className="pl-5">
            <div className="mb-4">
                {code ? <div className="h4 text-white text-sm-left">I have a code</div> :
                    <div className="d-flex justify-content-center justify-content-sm-start align-items-center text-secondary px-3">
                        {getIn ? <ActiveLink link="login">Get In</ActiveLink> : <InactiveLink link="login">Get In</InactiveLink>}
                        <div style={{ fontSize: 30 }} className="text-yellow text-100 px-3">|</div>
                        {signUp ? <ActiveLink link="register">Sign Up</ActiveLink> : <InactiveLink link="register">Sign Up</InactiveLink>}
                        <div style={{ fontSize: 30 }} className="text-yellow text-100 px-3">|</div>
                        {guest ? <ActiveLink link="guest">Guest</ActiveLink> : <InactiveLink link="guest">Guest</InactiveLink>}
                    </div>}
            </div>
            {children}
        </Col>

        <Col xs={5}>
            <img className="ml-5 float-right img-fluid" alt="mancompute" src={manMoney} />
        </Col>
    </Row>
</FrontEnd>;
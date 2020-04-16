import React from 'react';
import { Row, Col } from 'reactstrap';
import { NavLink } from 'react-router-dom';

import Title from '../../../components/UI/Title/Title';

import manpaye from '/invest-laravel/images/Group 136@2x.png';
import limoImg from '/invest-laravel/images/Liom-logo-New@2x.png';
import mobileImg from '/invest-laravel/images/Group 138@2x.png';
import btcImg from '/invest-laravel/images/bitcoin@2x.png';

const MethodImg = ({ src, disabled }) => <img src={src} alt="Payment" width={26} className="mr-2" style={disabled ? { filter: 'grayscale(1)' } : null} />;

const ActiveLink = ({ link, src, children }) => <div className="text-white position-relative h4"><NavLink className="text-decoration-none text-white" to={link}><MethodImg src={src} />{children}</NavLink></div>;
const InactiveLink = ({ link, src, children }) => <div className="m-0 h6"><NavLink className="text-decoration-none text-gray" to={link}><MethodImg src={src} disabled />{children}</NavLink></div>;

export default ({ limo, mobile, btc, children, loading, link }) => <>
    <Title check>Well done ! Please make payment and proceed to next step</Title>

    <div className="mx-auto w-90 flex-fill d-flex align-items-center">
        <Row className="justify-content-between align-items-center flex-fill">
            <Col xs={6} className="border-right border-border pr-5 py-5">
                <Row className="justify-content-center align-items-center">
                    <Col xs={12}>
                    {!loading ?
                        <>
                            <div className="mb-4 mr-auto">
                                <div className="d-flex justify-content-center justify-content-sm-start align-items-center text-secondary px-3">
                                    {limo ? <ActiveLink link={link + '/limo'} src={limoImg}>Limo</ActiveLink> : <InactiveLink link={link + '/limo'} src={limoImg}>Limo</InactiveLink>}
                                    <div style={{ fontSize: 30 }} className="text-yellow text-100 px-3">|</div>
                                    {mobile ? <ActiveLink link={link + '/mobile'} src={mobileImg}>Mobile Payment</ActiveLink> : <InactiveLink link={link + '/mobile'} src={mobileImg}>Mobile Payment</InactiveLink>}
                                    <div style={{ fontSize: 30 }} className="text-yellow text-100 px-3">|</div>
                                    {btc ? <ActiveLink link={link + '/btc'} src={btcImg}>Bitcoin</ActiveLink> : <InactiveLink link={link + '/btc'} src={btcImg}>Bitcoin</InactiveLink>}
                                </div>
                            </div>

                            <div className="w-70">{children}</div>
                        </>
                    : children}
                    </Col>
                </Row>
            </Col>
            <Col xs={4}>
                <img alt="mancompute" src={manpaye} className="img-fluid" />
            </Col>
        </Row>
    </div>
</>;
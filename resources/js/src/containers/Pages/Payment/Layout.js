import React from 'react';
import { Row, Col } from 'reactstrap';
import { NavLink } from 'react-router-dom';

import FrontEnd from '../../FrontEnd';

import Title from '../../../components/UI/Title/Title';

import manpaye from '../../../assets/images/Group 136@2x.png';
import limoImg from '../../../assets/images/Liom-logo-New@2x.png';
import mobileImg from '../../../assets/images/Group 138@2x.png';
import btcImg from '../../../assets/images/bitcoin@2x.png';

const MethodImg = ({ src, disabled }) => <><img src={src} alt="Payment" width={26} className="mr-2 d-none d-md-inline" style={disabled ? { filter: 'grayscale(1)' } : null} /><img src={src} alt="Payment" width={17} className="mr-2 d-md-none" style={disabled ? { filter: 'grayscale(1)' } : null} /></>;

const ActiveLink = ({ link, src, children }) => <><div className="d-md-none text-white position-relative text-700"><NavLink className="text-nowrap text-decoration-none text-white" to={link}><MethodImg src={src} />{children}</NavLink></div><div className="d-none d-md-block text-white position-relative h4"><NavLink className="text-nowrap text-decoration-none text-white" to={link}><MethodImg src={src} />{children}</NavLink></div></>;
const InactiveLink = ({ link, src, children }) => <><div className="d-md-none m-0 text-small text-700"><NavLink className="text-nowrap text-decoration-none text-gray" to={link}><MethodImg src={src} disabled />{children}</NavLink></div><div className="d-none d-md-block m-0 h6"><NavLink className="text-nowrap text-decoration-none text-gray" to={link}><MethodImg src={src} disabled />{children}</NavLink></div></>;

export default ({ limo, mobile, btc, children, loading, link }) => <>
    <Title check>Well done ! Please make payment and proceed to next step</Title>

    <div className="mx-auto col-md-11 px-0 flex-fill d-flex align-items-center">
        <Row className="justify-content-between align-items-center flex-fill">
            <Col xl={6} className="border-right-sm border-right-0 border-border pr-md-5 py-5">
                <Row className="justify-content-center align-items-center">
                    <Col xs={12}>
                    {!loading ?
                        <>
                            <div className="mb-4 mr-auto">
                                <div className="d-flex justify-content-center justify-content-sm-start align-items-center text-secondary px-md-3">
                                    {limo ? <ActiveLink link={link + '/limo'} src={limoImg}>Limo</ActiveLink> : <InactiveLink link={link + '/limo'} src={limoImg}>Limo</InactiveLink>}
                                    <div style={{ fontSize: 30 }} className="text-yellow text-100 px-md-3 px-2">|</div>
                                    {mobile ? <ActiveLink link={link + '/mobile'} src={mobileImg}>Mobile Payment</ActiveLink> : <InactiveLink link={link + '/mobile'} src={mobileImg}>Mobile Payment</InactiveLink>}
                                    <div style={{ fontSize: 30 }} className="text-yellow text-100 px-md-3 px-2">|</div>
                                    {btc ? <ActiveLink link={link + '/btc'} src={btcImg}>Bitcoin</ActiveLink> : <InactiveLink link={link + '/btc'} src={btcImg}>Bitcoin</InactiveLink>}
                                </div>
                            </div>

                            <div className={"px-0 " + (limo ? "w-100" : "col-md-8")}>{children}</div>
                        </>
                    : children}
                    </Col>
                </Row>
            </Col>
            <Col xl={4} className="d-none d-md-block">
                <img alt="mancompute" src={manpaye} className="img-fluid" />
            </Col>
        </Row>
    </div>
</>;
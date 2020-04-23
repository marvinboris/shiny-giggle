import React from 'react';
import { Col, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const card = ({ title, titleColor = 'white', details, children, link, icon, color, circleBorder = 'orange', circleColor = 'white' }) => {
    return (
        <Col xs={12} md={12} lg={6} xl={3} className="pb-3">
            <Col xs={12} className={`h-100 rounded overflow-hidden position-relative bg-${color}`}>
                <Row>
                    <Col xs={12} className="py-3 border-bottom border-border position-relative">
                        <span className={`text-large text-700 text-${titleColor}`}>{title}</span>

                        <div className={`rounded-circle position-absolute bg-${color} border border-2 border-${circleBorder}`} style={{ width: 20, height: 20, bottom: 0, left: 16, transform: 'translateY(50%)', padding: 2 }}>
                            <div className={`rounded-circle w-100 h-100 bg-${circleColor}`} />
                        </div>
                    </Col>

                    <Col xs={12} className="py-3 pl-5 position-relative">
                        <span style={{ zIndex: 0, top: 16, right: 16 }} className="position-absolute">
                            <FontAwesomeIcon icon={icon} style={{ zIndex: 0 }} className="text-white-20" size="4x" />
                        </span>
                        <h1 style={{ zIndex: 10 }} className="text-light text-montserrat text-700">{children}</h1>
                        <div style={{ zIndex: 10 }} className="text-light text-300">{details}</div>
                    </Col>
                </Row>
            </Col>
        </Col>
    );
};

export default card;
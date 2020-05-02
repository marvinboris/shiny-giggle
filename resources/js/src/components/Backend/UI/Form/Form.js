import React from 'react';
import { Col, Form } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default ({ onSubmit, xs = 12, sm = 12, md = 12, lg = 12, xl = 12, icon, title, className = '', dark, innerClassName = '', outerClassName = '', p0, children, style }) => {
    return (
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} className={outerClassName}>
            <div className={"rounded-4 d-flex justify-content-between align-items-center mb-5 mt-3 py-4 px-4 text-large " + className}>
                <span className="d-inline-flex align-items-center text-orange">{icon ? <FontAwesomeIcon fixedWidth className="mr-2" icon={icon} size="lg" /> : null}{title}</span>
            </div>

            <div className={"d-flex flex-column " + (dark ? "text-light " : " ") + className} style={style}>
                <div className={"flex-fill d-flex flex-column " + (!p0 ? "p-4" : "p-0")}>
                    <div className="flex-fill">
                        <Form onSubmit={onSubmit} className={innerClassName}>
                            {children}
                        </Form>
                    </div>
                </div>
            </div>
        </Col>
    );
};
import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Form, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks } from '@fortawesome/free-solid-svg-icons';

export default ({ onSubmit, xs = 12, sm = 12, md = 12, lg = 12, xl = 12, icon, title, className = '', dark, innerClassName = '', outerClassName = '', p0, children, style, id, list, link }) => {
    return (
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} className={outerClassName}>
            <div className={"rounded-4 d-flex justify-content-between align-items-center mb-5 mt-3 py-4 px-4 text-large " + className}>
                <span className="d-inline-flex align-items-center text-orange">{icon ? <FontAwesomeIcon fixedWidth className="mr-2" icon={icon} size="lg" /> : null}{title}</span>

                {list ? <Link to={link}><Button color="orange" size="lg" className="rounded-2"><FontAwesomeIcon fixedWidth className="mr-2" icon={faTasks} />{list}</Button></Link> : null}
            </div>

            <div className={"d-flex flex-column " + (dark ? "text-light " : " ") + className} style={style}>
                <div className={"flex-fill d-flex flex-column " + (!p0 ? "p-4" : "p-0")}>
                    <div className="flex-fill">
                        <Form onSubmit={onSubmit} id={id} className={innerClassName} encType="multipart/form-data">
                            {children}
                        </Form>
                    </div>
                </div>
            </div>
        </Col>
    );
};
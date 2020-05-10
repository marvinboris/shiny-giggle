import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const breadcrumb = ({ items, main, icon }) => {
    let itemsComponent = null;

    if (items) itemsComponent = items.map((item, i) => (
        <BreadcrumbItem key={i}><Link className="text-white" to={item.to}>{item.content}</Link></BreadcrumbItem>
    ));

    return (
        <Breadcrumb className="d-none d-sm-flex align-items-center" color="white" listClassName="bg-transparent rounded-0 justify-content-end text-large" style={{ top: '50%', right: 0, transform: 'translateY(-30px)', position: 'absolute', zIndex: 1000 }}>
            <BreadcrumbItem><Link className="text-white" to="/"><FontAwesomeIcon icon={icon} className="mr-1" /> <strong>Home</strong></Link></BreadcrumbItem>
            {itemsComponent}
            <BreadcrumbItem className="text-white text-decoration-none" active>{main}</BreadcrumbItem>
        </Breadcrumb>
    );
};

export default breadcrumb;
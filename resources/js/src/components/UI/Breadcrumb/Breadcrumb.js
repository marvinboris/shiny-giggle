import React from 'react';
import { NavLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Container } from 'reactstrap';

const breadcrumb = ({ items, main }) => {
    let itemsComponent = null;

    if (items) itemsComponent = items.map((item, i) => (
        <BreadcrumbItem key={i}><NavLink className="text-info" to={item.to}>{item.content}</NavLink></BreadcrumbItem>
    ));

    return (
        <div className="container-fluid bg-light">
            <Container className="p-0">
                <Breadcrumb listClassName="bg-transparent rounded-0">
                    <BreadcrumbItem><NavLink className="text-info" to="/">Accueil</NavLink></BreadcrumbItem>
                    {itemsComponent}
                    <BreadcrumbItem className="text-danger" active>{main}</BreadcrumbItem>
                </Breadcrumb>
            </Container>
        </div>
    );
};

export default breadcrumb;
import React from 'react';
import { Col, Table, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faArrowsAlt } from '@fortawesome/free-solid-svg-icons';

export default ({ fields, array, limit, bordered, xs, sm, md, lg, xl, className = '', title, icon, dark, borderless, innerClassName = '', outerClassName = '', p0, select, children, selectHandler, style }) => {
    const titles = fields.map(({ name }) => <th className="align-middle text-nowrap" key={name}>{name}</th>);
    titles.unshift(<th className="text-center align-middle" key="#">SL</th>);
    if (select) titles.unshift(<th className="align-middle text-center" key="select_all">
        <input type="checkbox" onClick={selectHandler} className="select_all" />
    </th>);

    const content = array.map((item, index) => {
        if (limit && index >= limit) return null;
        let inside = [<th className="text-center align-middle" key={'primary' + index}>{index + 1}</th>];
        if (select) inside.unshift(<th className="text-center align-middle" key={'secondary' + index}>
            <input type="checkbox" value={item._id} />
        </th>);
        fields.forEach(({ key }) => {
            inside.push(<td className="align-middle text-nowrap" key={key}>{item[key]}</td>);
        });

        return <tr className="align-middle" key={index + 1}>{inside}</tr>;
    });


    return (
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} className={outerClassName}>
            <div className={"d-flex flex-column h-100 " + (dark ? "text-light " : " ") + className} style={style}>
                <div className="p-3 border-bottom border-border text-orange text-700 d-flex position-relative">
                    <span className="d-inline-flex align-items-center">{icon ? <FontAwesomeIcon fixedWidth className="mr-2" icon={icon} size="lg" /> : null}{title}</span>

                    <div className="ml-auto d-none d-lg-flex justify-content-end align-items-center text-white position-absolute" style={{ top: '50%', right: 16, transform: 'translateY(-50%)' }}>
                        <Input type="search" placeholder="Search here..." className="small bg-darkblue rounded-0 border-0 text-white mr-3" />

                        <FontAwesomeIcon icon={faArrowsAlt} size="lg" className="mr-3" />

                        <FontAwesomeIcon icon={faTimes} size="2x" />
                    </div>
                </div>
                <div className={"flex-fill d-flex flex-column " + (!p0 ? "p-3" : "p-0")}>
                    <div className="table-responsive flex-fill">
                        <Table dark={dark} bordered={bordered} borderless={borderless} className={innerClassName}>
                            <thead className="text-gray"><tr>{titles}</tr></thead>
                            <tbody className="bg-darklight-50 text-light">{content}</tbody>
                        </Table>
                    </div>

                    <div className="pt-3">
                        {children}
                    </div>
                </div>
            </div>
        </Col>
    );
};
import React from 'react';
import { Col, Table, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faArrowsAlt } from '@fortawesome/free-solid-svg-icons';

const table = ({ fields, array, limit, bordered, xs, sm, md, lg, xl, className, title, icon, dark, borderless, innerClassName, p0, select, children, selectHandler, style }) => {
    const titles = fields.map(({ name }) => <th className="align-middle" key={name}>{name}</th>);
    titles.unshift(<th className="text-center align-middle" key="#">SL</th>);
    if (select) titles.unshift(<th className="align-middle text-center" key="select_all">
        <input type="checkbox" onClick={selectHandler} className="select_all" />
    </th>);
    const keys = fields.map(({ key }) => key);

    const content = array.map((item, index) => {
        if (limit && index >= limit) return null;
        let inside = [<th className="text-center align-middle" key={'primary' + index}>{index + 1}</th>];
        if (select) inside.unshift(<th className="text-center align-middle" key={'secondary' + index}>
            <input type="checkbox" value={item._id} />
        </th>);
        for (const key in item) {
            if (item.hasOwnProperty(key)) {
                const element = item[key];
                if (keys.includes(key)) inside.push(<td className="align-middle" key={key}>{element}</td>);
            }
        }

        return <tr className="align-middle" key={index + 1}>{inside}</tr>;
    });

    console.log({ titles, keys, content })

    return (
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} className="h-100">
            <div className={(dark ? "text-light " : " ") + className} style={style}>
                <div className="p-3 border-bottom border-border text-orange text-700 d-flex position-relative">
                    <span className="d-inline-flex align-items-center">{icon ? <FontAwesomeIcon fixedWidth className="mr-2" icon={icon} size="lg" /> : null}{title}</span>

                    <div className="ml-auto d-flex justify-content-end align-items-center text-white position-absolute" style={{ top: '50%', right: 16, transform: 'translateY(-50%)' }}>
                        <Input type="search" placeholder="Search here..." className="small bg-darkblue rounded-0 border-0 text-white mr-3" />

                        <FontAwesomeIcon icon={faArrowsAlt} size="lg" className="mr-3" />

                        <FontAwesomeIcon icon={faTimes} size="2x" />
                    </div>
                </div>
                <div className={(!p0 ? "p-3" : "p-0")}>
                    <div className="table-responsive-xl">
                        <Table dark={dark} bordered={bordered} borderless={borderless} className={innerClassName}>
                            <thead className="text-gray"><tr>{titles}</tr></thead>
                            <tbody className="bg-darklight-50 text-light">{content}</tbody>
                        </Table>
                    </div>

                    <div className="mt-3">
                        {children}
                    </div>
                </div>
            </div>
        </Col>
    );
};

export default table;
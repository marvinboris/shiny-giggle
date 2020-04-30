import React from 'react';
import { Col, Table, Button, Input, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faFileExcel, faFilePdf, faFileCsv, faPrint } from '@fortawesome/free-solid-svg-icons';

export default ({ fields, array, limit, bordered, xs = 12, sm = 12, md = 12, lg = 12, xl = 12, icon, title, add, className = '', dark, borderless, innerClassName = '', outerClassName = '', p0, select, children, selectHandler, style }) => {
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
            <div className={"rounded-4 d-flex justify-content-between align-items-center mb-5 mt-3 py-4 px-4 text-large " + className}>
                <span className="d-inline-flex align-items-center text-orange">{icon ? <FontAwesomeIcon fixedWidth className="mr-2" icon={icon} size="lg" /> : null}{title}</span>

                <Button color="green" size="lg" className="rounded-2">
                    <FontAwesomeIcon icon={faPlusCircle} fixedWidth className="mr-2" />
                    {add}
                </Button>
            </div>

            <div className={"d-flex flex-column " + (dark ? "text-light " : " ") + className} style={style}>
                <div className="p-4 border-bottom border-border text-orange text-700 position-relative">
                    <Row className="align-items-center justify-content-between">
                        <div className="col-6 pb-2 pb-lg-0 col-lg-2">
                            <div className="d-flex align-items-center text-secondary rounded-2 overflow-hidden bg-darkblue">
                                <div className="px-3 py-2 font-weight-bold border-right border-black-20">Show</div>
                                <Input type="select" name="show" className="px-3 py-2 text-center d-block text-reset border-0 bg-darkblue">
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="All">All</option>
                                </Input>
                            </div>
                        </div>

                        <div className="col-6 d-lg-none pb-2 pb-lg-0">
                            <Input type="search" className="bg-darkblue border-0 rounded-2" placeholder="Search..." />
                        </div>

                        <div className="col-lg-4 pb-2 pb-lg-0 rounded-2 overflow-hidden">
                            <div className="bg-darkblue d-flex text-light justify-content-around align-items-center font-weight-bold py-2">
                                <a href="{{ route('export.xlsx') }}" className="px-2 export text-decoration-none text-reset"><FontAwesomeIcon icon={faFileExcel} className="fas fa-file-excel text-darkblue mr-2" />Excel</a>
                                <a href="{{ route('export.pdf') }}" className="px-2 export text-decoration-none text-reset"><FontAwesomeIcon icon={faFilePdf} className="fas fa-file-pdf text-danger mr-2" />PDF</a>
                                <a href="{{ route('export.csv') }}" className="px-2 export text-decoration-none text-reset"><FontAwesomeIcon icon={faFileCsv} className="fas fa-file-csv text-green mr-2" />CSV</a>
                                <a href="{{ route('export.pdf') }}" className="px-2 export text-decoration-none text-reset"><FontAwesomeIcon icon={faPrint} className="fas fa-print text-primary mr-2" />Print</a>
                            </div>
                        </div>

                        <div className="col-lg-2 d-none d-lg-block">
                            <Input type="search" className="bg-darkblue border-0 rounded-2" placeholder="Search..." />
                        </div>
                    </Row>
                </div>

                <div className={"flex-fill d-flex flex-column " + (!p0 ? "p-4" : "p-0")}>
                    <div className="table-responsive flex-fill">
                        <Table dark={dark} bordered={bordered} borderless={borderless} className={innerClassName}>
                            <thead className="text-gray"><tr>{titles}</tr></thead>
                            <tbody className="bg-darklight-50 text-light">{content}</tbody>
                        </Table>
                    </div>

                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </Col>
    );
};
import React, { useState } from 'react';
import { Col, Table, Button, Input, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faFileExcel, faFilePdf, faFileCsv, faPrint, faAngleDoubleLeft, faChevronLeft, faChevronRight, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default ({ fields, array, data, limit, bordered, xs = 12, sm = 12, md = 12, lg = 12, xl = 12, icon, title, add, link, className = '', dark, borderless, innerClassName = '', outerClassName = '', p0, select, children, selectHandler, style }) => {
    const titles = fields.map(({ name }) => <th className="align-middle text-nowrap" key={name}>{name}</th>);
    titles.unshift(<th className="text-center align-middle" key="#">SL</th>);
    if (select) titles.unshift(<th className="align-middle text-center" key="select_all">
        <input type="checkbox" onClick={selectHandler} className="select_all" />
    </th>);

    const [show, setShow] = useState(10);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageFirst, setPageFirst] = useState(1);
    const [pageSecond, setPageSecond] = useState(2);
    const [pageLast, setPageLast] = useState(3);

    const filteredArray = search === '' ? array : array.filter((item, i) => {
        let check = false;
        for (const iterator of fields) {
            const key = iterator.key;
            if (typeof item[key] === 'string') check = item[key].toLowerCase().includes(search.toLowerCase());
            if (check) return check;
        }
    });
    const limitedArray = show === 'All' ? filteredArray : filteredArray.filter((item, i) => (i >= (page - 1) * show) && (i < page * show));

    const content = limitedArray.map((item, index) => {
        if (limit && index >= limit) return null;
        let inside = [<th className="text-center align-middle" key={'primary' + index}>{index + 1}</th>];
        if (select) inside.unshift(<th className="text-center align-middle" key={'secondary' + index}>
            <input type="checkbox" value={item._id} />
        </th>);
        fields.forEach(({ key, minWidth }) => {
            inside.push(<td className="align-middle text-nowrap position-relative" style={{ minWidth }} key={key}>{item[key]}</td>);
        });

        return <tr className="align-middle" key={index + 1}>{inside}</tr>;
    });

    const inputChangedHandler = e => {
        const { name, value } = e.target;
        if (name === 'show') {
            firstPageHandler();
            return setShow(value);
        }
        if (name === 'search') return setSearch(value);
    }

    const previousPageHandler = () => {
        if (page <= 1) return;
        setPage(page - 1);
        setPageFirst(pageFirst - 1);
        setPageSecond(pageSecond - 1);
        setPageLast(pageLast - 1);
    }

    const nextPageHandler = () => {
        if (page >= Math.ceil(limitedArray.length / show)) return;
        setPage(page + 1);
        setPageFirst(pageFirst + 1);
        setPageSecond(pageSecond + 1);
        setPageLast(pageLast + 1);
    }

    const firstPageHandler = () => {
        if (page <= 1) return;
        setPage(1);
        setPageFirst(1);
        setPageSecond(2);
        setPageLast(3);
    }

    const lastPageHandler = () => {
        const lastPage = Math.ceil(limitedArray.length / show);
        if (page >= lastPage) return;
        setPage(lastPage);
        setPageFirst(lastPage - 2);
        setPageSecond(lastPage - 1);
        setPageLast(lastPage);
    }

    const pageChangeHandler = page => {
        const lastPage = Math.ceil(limitedArray.length / show);
        let pageFirst;
        if (page === 1) pageFirst = 1;
        else if (page === lastPage) pageFirst = lastPage - 2;
        else pageFirst = page - 1;
        setPage(page);
        setPageFirst(pageFirst);
        setPageSecond(pageFirst + 1);
        setPageLast(pageFirst + 2);
    }

    const onClick = e => {
        e.preventDefault();

        const url = e.target.href;
        exportData(url);
    };

    const exportData = async url => {
        const format = url.split('/')[url.split('/').length - 1];
        const name = title + '.' + format;
        const token = localStorage.getItem('token');

        try {
            const formData = new FormData();

            formData.append('data', data);
            formData.append('name', name);

            const res = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: formData,
                headers: {
                    Authorization: token
                }
            });

            const resData = await res.blob();

            const downloadLink = URL.createObjectURL(resData);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = downloadLink;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadLink);
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} className={outerClassName}>
            <div className={"rounded-4 d-flex justify-content-between align-items-center mb-5 mt-3 py-4 px-4 text-large " + className}>
                <span className="d-inline-flex align-items-center text-orange">{icon ? <FontAwesomeIcon fixedWidth className="mr-2" icon={icon} size="lg" /> : null}{title}</span>

                {add ? <Link to={link}>
                    <Button color="green" size="lg" className="rounded-2">
                        <FontAwesomeIcon icon={faPlusCircle} fixedWidth className="mr-2" />
                        {add}
                    </Button>
                </Link> : null}
            </div>

            <div className={"d-flex flex-column " + (dark ? "text-light " : " ") + className} style={style}>
                <div className="p-4 border-bottom border-border text-orange text-700 position-relative">
                    <Row className="align-items-center justify-content-between">
                        <div className="col-6 pb-2 pb-lg-0 col-lg-2">
                            <div className="d-flex align-items-center text-secondary rounded-2">
                                <div className="px-3 py-2 font-weight-bold h-100 border-bottom border-darkblue bg-darkblue">Show</div>
                                <Input type="select" name="show" onChange={inputChangedHandler} className="px-3 py-2 text-center rounded-0 h-100 d-block text-reset border-top-0 border-right-0 border-bottom-0 border-black-20 bg-darkblue" style={{ width: '5rem' }}>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="All">All</option>
                                </Input>
                            </div>
                        </div>

                        <div className="col-6 d-lg-none pb-2 pb-lg-0">
                            <Input type="search" name="search" onChange={inputChangedHandler} className="bg-darkblue border-0 rounded-2" placeholder="Search..." />
                        </div>

                        <div className="col-lg-4 pb-2 pb-lg-0 rounded-2 overflow-hidden">
                            <div className="bg-darkblue d-flex text-light justify-content-around align-items-center font-weight-bold py-3">
                                <a href="/api/export/xlsx" onClick={onClick} className="px-2 text-decoration-none text-reset"><FontAwesomeIcon icon={faFileExcel} className="text-white mr-2" />Excel</a>
                                <a href="/api/export/pdf" onClick={onClick} className="px-2 text-decoration-none text-reset"><FontAwesomeIcon icon={faFilePdf} className="text-danger mr-2" />PDF</a>
                                <a href="/api/export/csv" onClick={onClick} className="px-2 text-decoration-none text-reset"><FontAwesomeIcon icon={faFileCsv} className="text-green mr-2" />CSV</a>
                                <a href="/api/export/pdf" onClick={onClick} className="px-2 text-decoration-none text-reset"><FontAwesomeIcon icon={faPrint} className="text-primary mr-2" />Print</a>
                            </div>
                        </div>

                        <div className="col-lg-2 d-none d-lg-block">
                            <Input type="search" name="search" onChange={inputChangedHandler} className="bg-darkblue border-0 rounded-2" placeholder="Search..." />
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

                    <div>
                        <div>Showing {limitedArray.length} of {filteredArray.length} entries.</div>

                        <div className="pt-2 d-flex justify-content-end">
                            {show === 'All' ? null : <ul className="pagination btn-group">
                                {page === 1 ? null :
                                    <>
                                        <li className="btn btn-yellow" onClick={firstPageHandler}><FontAwesomeIcon icon={faAngleDoubleLeft} className="mr-2" />First</li>
                                        <li className="btn btn-darkblue text-secondary" onClick={(previousPageHandler)}><FontAwesomeIcon icon={faChevronLeft} /></li>
                                    </>
                                }
                                <li className={"btn btn-darkblue " + (page === pageFirst ? 'text-700 active' : 'secondary')} onClick={() => pageChangeHandler(pageFirst)}>{pageFirst}</li>
                                {Math.ceil(filteredArray.length / show) > 1 ?
                                    <>
                                        <li className={"btn btn-darkblue " + (page === pageSecond ? 'text-700 active' : 'secondary')} onClick={() => pageChangeHandler(pageSecond)}>{pageSecond}</li>
                                    </>
                                    : null}
                                {page === Math.ceil(filteredArray.length / show) ? null :
                                    <>
                                        <li className={"btn btn-darkblue " + (page === pageLast ? 'text-700 active' : 'secondary')} onClick={() => pageChangeHandler(pageLast)}>{pageLast}</li>
                                        <li className="btn btn-darkblue text-secondary" onClick={nextPageHandler}><FontAwesomeIcon icon={faChevronRight} /></li>
                                        <li className="btn btn-lightblue" onClick={lastPageHandler}>Last<FontAwesomeIcon icon={faAngleDoubleRight} className="ml-2" /></li>
                                    </>
                                }
                            </ul>}
                        </div>
                    </div>
                </div>
            </div>
        </Col>
    );
};
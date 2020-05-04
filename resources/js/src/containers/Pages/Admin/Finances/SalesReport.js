import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Col, Row, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faUsers, faThList, faTimesCircle, faCheckCircle, faPrint, faUserTie } from '@fortawesome/free-solid-svg-icons';

// Components
import BackEnd from '../../../BackEnd';

import Breadcrumb from '../../../../components/Backend/UI/Breadcrumb/Breadcrumb';
import SpecialTitle from '../../../../components/UI/Titles/SpecialTitle/SpecialTitle';
import Subtitle from '../../../../components/UI/Titles/Subtitle/Subtitle';
import Error from '../../../../components/Error/Error';
import CustomSpinner from '../../../../components/UI/CustomSpinner/CustomSpinner';
import List from '../../../../components/Backend/UI/List/List';

import * as actions from '../../../../store/actions';
import { updateObject, convertDate } from '../../../../shared/utility';

class SalesReport extends Component {
    componentDidMount() {
        const { onGetAdminSalesReport } = this.props;
        onGetAdminSalesReport();
    }

    render() {
        let { backend: { finances: { loading, error, salesReport } } } = this.props;
        let content = null;
        let errors = null;

        if (loading) content = <Col xs={12}>
            <CustomSpinner />
        </Col>;
        else {
            errors = <>
                <Error err={error} />
            </>;
            if (salesReport) {
                const vendors = {
                    monetbil: 'Mobile'
                };
                const salesReportData = salesReport.map(transaction => {
                    return updateObject(transaction, {
                        name: transaction.name || transaction.transactionable.first_name + ' ' + transaction.transactionable.last_name,
                        ref: transaction.transactionable.ref,
                        plan_name: transaction.plan.name,
                        plan_price: transaction.plan.price,
                        plan_code: transaction.status === 'completed' ? transaction.data.code : <span className="text-capitalize">{transaction.status}</span>,
                        updated_at: convertDate(transaction.updated_at),
                        vendor: vendors[transaction.vendor],
                        status: transaction.status === 'completed' ?
                            <Badge color="success" className="badge-block position-static"><FontAwesomeIcon icon={faCheckCircle} className="mr-2" fixedWidth />Paid</Badge> :
                            <Badge color="danger" className="badge-block position-static"><FontAwesomeIcon icon={faTimesCircle} className="mr-2" fixedWidth />Cancelled</Badge>,
                        action: <div className="text-center">
                            <FontAwesomeIcon icon={faEye} className="text-lightblue mr-2" fixedWidth />
                            <FontAwesomeIcon icon={faPrint} className="text-green mr-2" fixedWidth />
                        </div>
                    });
                });

                content = (
                    <>
                        <Row>
                            <List array={salesReportData} dark bordered icon={faUserTie} title="Sales Report" innerClassName="bg-darkblue" className="bg-darklight shadow-sm"
                                fields={[
                                    { name: 'Full Name', key: 'name' },
                                    { name: 'User ID', key: 'ref' },
                                    { name: 'Purchased plan', key: 'plan_name' },
                                    { name: 'Amount', key: 'plan_price' },
                                    { name: 'Plan ID', key: 'plan_code' },
                                    { name: 'Purchased Date & Time', key: 'updated_at' },
                                    { name: 'Payment Method', key: 'vendor' },
                                    { name: 'Status', key: 'status' },
                                    { name: 'Action', key: 'action' }
                                ]} />
                        </Row>
                    </>
                );
            }
        }

        return (
            <BackEnd>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main="Sales Report" icon={faUserTie} />
                    <SpecialTitle user icon={faUserTie}>Admin panel</SpecialTitle>
                    <Subtitle user>Sales Report</Subtitle>
                </div>
                <div className="p-4 pb-0">
                    {errors}
                    {content}
                </div>
            </BackEnd>
        );
    }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onGetAdminSalesReport: () => dispatch(actions.getAdminSalesReport()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SalesReport));
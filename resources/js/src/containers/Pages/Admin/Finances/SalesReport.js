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
        let { backend: { finances: { loading, error, salesReport, total } } } = this.props;
        let content = null;
        let errors = null;

        if (!salesReport) salesReport = [];

        let salesReportData = [];

        errors = <>
            <Error err={error} />
        </>;

        salesReportData = salesReport.map(transaction => {
            let plan_code, plan_name;
            if (transaction.status === 2) {
                if (transaction.type === 'plan') {
                    plan_name = transaction.plan.name;
                    plan_code = transaction.code;
                }
                else if (transaction.type === 'credits') {
                    plan_name = 'Credits';
                    plan_code = 'Credits';
                }
            } else {
                if (transaction.type === 'plan') {
                    plan_name = 'Plan';
                    plan_code = 'Not completed';
                }
                else if (transaction.type === 'credits') {
                    plan_name = 'Credits';
                    plan_code = 'Not completed';
                }
            }
            return updateObject(transaction, {
                name: transaction.user.name || transaction.user.first_name + ' ' + transaction.user.last_name,
                ref: transaction.user.ref,
                plan_name,
                plan_code,
                amount: transaction.amount.toString(),
                updated_at: convertDate(transaction.updated_at),
                vendor: transaction.method.name,
                status: transaction.status === 2 ?
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
                    <List loading={loading} array={salesReportData} data={JSON.stringify(salesReport)} get={this.props.onGetAdminSalesReport} total={total} dark bordered icon={faUserTie} title="Sales Report" innerClassName="bg-darkblue" className="bg-darklight shadow-sm"
                        fields={[
                            { name: 'Full Name', key: 'name' },
                            { name: 'User ID', key: 'ref' },
                            { name: 'Purchased plan', key: 'plan_name' },
                            { name: 'Amount', key: 'amount' },
                            { name: 'Plan ID', key: 'plan_code' },
                            { name: 'Purchased Date & Time', key: 'updated_at' },
                            { name: 'Payment Method', key: 'vendor' },
                            { name: 'Status', key: 'status' },
                            { name: 'Action', key: 'action' }
                        ]} />
                </Row>
            </>
        );

        return (
            <>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main="Sales Report" icon={faUserTie} />
                    <SpecialTitle user icon={faUserTie}>Admin panel</SpecialTitle>
                    <Subtitle user>Sales Report</Subtitle>
                </div>
                <div className="p-4 pb-0">
                    {errors}
                    {content}
                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onGetAdminSalesReport: (page, show, search) => dispatch(actions.getAdminSalesReport(page, show, search)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SalesReport));
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Col, Row, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faUsers, faThList, faTimesCircle, faCheckCircle, faPrint, faUserTie, faEdit, faSpinner } from '@fortawesome/free-solid-svg-icons';

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

class LimoPayments extends Component {
    componentDidMount() {
        const { onGetAdminLimoPayments } = this.props;
        onGetAdminLimoPayments();
    }

    render() {
        let { backend: { finances: { loading, error, limoPayments, total } } } = this.props;
        let content = null;
        let errors = null;

        if (!limoPayments) limoPayments = [];

        let limoPaymentsData = [];

        errors = <>
            <Error err={error} />
        </>;

        limoPaymentsData = limoPayments.map(limoPayment => {
            return updateObject(limoPayment, {
                name: limoPayment.user.first_name + ' ' + limoPayment.user.last_name,
                ref: limoPayment.user.ref,
                updated_at: convertDate(limoPayment.updated_at),
                status: limoPayment.status === 0 ? <Badge color="orange" className="badge-block position-static"><FontAwesomeIcon icon={faSpinner} className="fa-spin" fixedWidth /><span className="ml-2">Pending</span></Badge> :
                    limoPayment.status === 2 ? <Badge color="success" className="badge-block position-static"><FontAwesomeIcon icon={faCheckCircle} className="mr-2" fixedWidth />Success</Badge> :
                        <Badge color="danger" className="badge-block position-static"><FontAwesomeIcon icon={faTimesCircle} className="mr-2" fixedWidth />Failed</Badge>,
                action: <div className="text-center">
                    <FontAwesomeIcon icon={faEye} className="text-lightblue mr-2" fixedWidth />
                    <Link className="text-decoration-none text-green mr-2" to={'/admin/finances/limo-payments/' + limoPayment.id + '/edit'}><FontAwesomeIcon icon={faEdit} fixedWidth /></Link>
                </div>
            });
        });

        content = (
            <>
                <Row>
                    <List loading={loading} array={limoPaymentsData} data={JSON.stringify(limoPayments)} get={this.props.onGetAdminLimoPayments} total={total} dark bordered icon={faUserTie} title="Limo Payments" innerClassName="bg-darkblue" className="bg-darklight shadow-sm"
                        fields={[
                            { name: 'Full Name', key: 'name' },
                            { name: 'User ID', key: 'ref' },
                            { name: 'Transfer No', key: 'transfer_no' },
                            { name: 'Amount', key: 'amount' },
                            { name: 'Date', key: 'date' },
                            { name: 'Liyeplimal User ID', key: 'limo_id' },
                            { name: 'Updated at', key: 'updated_at' },
                            { name: 'Status', key: 'status', minWidth: 130 },
                            { name: 'Action', key: 'action' }
                        ]} />
                </Row>
            </>
        );

        return (
            <>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main="Limo Payments" icon={faUserTie} />
                    <SpecialTitle user icon={faUserTie}>Admin panel</SpecialTitle>
                    <Subtitle user>Limo Payments</Subtitle>
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
    onGetAdminLimoPayments: (page, show, search) => dispatch(actions.getAdminLimoPayments(page, show, search)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LimoPayments));
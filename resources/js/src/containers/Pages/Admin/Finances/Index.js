import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Col, Row, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faUsers, faUserTie, faTimesCircle, faCheckCircle, faPrint, faEdit, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';

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

class Index extends Component {
    componentDidMount() {
        const { onGetAdminCreditsList } = this.props;
        onGetAdminCreditsList();
    }

    render() {
        let { backend: { finances: { loading, error, deposits } } } = this.props;
        let content = null;
        let errors = null;

        if (loading) content = <Col xs={12}>
            <CustomSpinner />
        </Col>;
        else {
            errors = <>
                <Error err={error} />
            </>;
            if (deposits) {
                const depositsData = deposits.map(deposit => {
                    const colors = ['primary', 'danger', 'success'];
                    const texts = ['Pending', 'Failed', 'Success'];
                    const icons = [faSpinner, faTimesCircle, faCheckCircle];
                    return updateObject(deposit, {
                        name: deposit.user.first_name + ' ' + deposit.user.last_name,
                        ref: deposit.user.ref,
                        method_name: deposit.method.name,
                        created_at: convertDate(deposit.created_at),
                        status: <Badge color={colors[deposit.status]} className="badge-block position-static"><FontAwesomeIcon icon={icons[deposit.status]} className="mr-2" fixedWidth />{texts[deposit.status]}</Badge>,
                        action: <div className="text-center">
                            <FontAwesomeIcon icon={faEye} className="text-lightblue mr-2" fixedWidth />
                            <FontAwesomeIcon icon={faPrint} className="text-green mr-2" fixedWidth />
                        </div>
                    });
                });

                content = (
                    <>
                        <Row>
                            <List array={depositsData} dark bordered add="Add Credit" icon={faUserTie} title="Credit List" innerClassName="bg-darkblue" className="bg-darklight shadow-sm"
                                fields={[
                                    { name: 'Full Name', key: 'name' },
                                    { name: 'User ID', key: 'ref' },
                                    { name: 'Method', key: 'method_name' },
                                    { name: 'Amount', key: 'amount' },
                                    { name: 'Fees', key: 'fees' },
                                    { name: 'Comments', key: 'comments' },
                                    { name: 'Creation date', key: 'created_at' },
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
                    <Breadcrumb main="Credit List" icon={faUserTie} />
                    <SpecialTitle user icon={faUserTie}>Admin panel</SpecialTitle>
                    <Subtitle user>Credit List</Subtitle>
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
    onGetAdminCreditsList: () => dispatch(actions.getAdminCreditsList()),
    onGetAdminCreditsListStart: () => dispatch(actions.getAdminCreditsListStart()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));
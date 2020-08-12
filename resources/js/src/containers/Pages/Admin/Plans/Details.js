import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Col, Row, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faUsers, faTasks, faTimesCircle, faCheckCircle, faPrint, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

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
        const { onGetAdminPlanDetails } = this.props;
        onGetAdminPlanDetails();
    }

    componentWillUnmount() {
        const { onResetPlans } = this.props;
        onResetPlans();
    }

    render() {
        let { backend: { plans: { loading, error, plans } } } = this.props;
        let content = null;
        let errors = null;

        if (loading) content = <Col xs={12}>
            <CustomSpinner />
        </Col>;
        else {
            errors = <>
                <Error err={error} />
            </>;
            if (plans) {
                const plansData = plans.map(plan => {
                    return updateObject(plan, {
                        user_name: plan.user.first_name + ' ' + plan.user.last_name,
                        ref: plan.user.ref,
                        plan_name: plan.plan.name,
                        expiry_date: convertDate(plan.expiry_date),
                        created_at: convertDate(plan.created_at),
                        action: <div className="text-center">
                            <FontAwesomeIcon icon={faEye} className="text-lightblue mr-2" fixedWidth />
                            <FontAwesomeIcon icon={faEdit} className="text-green mr-2" fixedWidth />
                            <FontAwesomeIcon icon={faTrash} className="text-red" fixedWidth />
                        </div>
                    });
                });

                content = (
                    <>
                        <Row>
                            <List array={plansData} data={JSON.stringify(plans)} dark bordered icon={faTasks} title="Plan Details" innerClassName="bg-darkblue" className="bg-darklight shadow-sm"
                                fields={[
                                    { name: 'Full Name', key: 'user_name' },
                                    { name: 'User ID', key: 'ref' },
                                    { name: 'Plan', key: 'plan_name' },
                                    { name: 'Plan Code', key: 'code' },
                                    { name: 'Points', key: 'points' },
                                    { name: 'Used Calculations', key: 'calculations' },
                                    { name: 'Expiry Date', key: 'expiry_date' },
                                    { name: 'Creation date', key: 'created_at' },
                                    { name: 'Action', key: 'action' }
                                ]} />
                        </Row>
                    </>
                );
            }
        }

        return (
            <>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main="Plan Details" icon={faTasks} />
                    <SpecialTitle user icon={faTasks}>Admin panel</SpecialTitle>
                    <Subtitle user>Plan Details</Subtitle>
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
    onGetAdminPlanDetails: () => dispatch(actions.getAdminPlanDetails()),
    onResetPlans: () => dispatch(actions.resetPlans()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));
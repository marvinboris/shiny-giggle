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
        const { onGetAdminPlans } = this.props;
        onGetAdminPlans();
    }

    componentWillUnmount() {
        const { onResetAdminPlans } = this.props;
        onResetAdminPlans();
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
                            <List array={plansData} data={JSON.stringify(plans)} dark bordered add="Add Plan" link="/admin/plans/add" icon={faTasks} title="Plan List" innerClassName="bg-darkblue" className="bg-darklight shadow-sm"
                                fields={[
                                    { name: 'Name', key: 'name' },
                                    { name: 'Slug', key: 'slug' },
                                    { name: 'Points', key: 'points' },
                                    { name: 'Validity (weeks)', key: 'validity' },
                                    { name: 'Price', key: 'price' },
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
                    <Breadcrumb main="Plan List" icon={faTasks} />
                    <SpecialTitle user icon={faTasks}>Admin panel</SpecialTitle>
                    <Subtitle user>Plan List</Subtitle>
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
    onGetAdminPlans: () => dispatch(actions.getAdminPlans()),
    onResetAdminPlans: () => dispatch(actions.resetAdminPlans()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));
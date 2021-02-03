import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Col, Row, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faUsers, faThList, faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

// Components
import Breadcrumb from '../../../../components/Backend/UI/Breadcrumb/Breadcrumb';
import SpecialTitle from '../../../../components/UI/Titles/SpecialTitle/SpecialTitle';
import Subtitle from '../../../../components/UI/Titles/Subtitle/Subtitle';
import Error from '../../../../components/Error/Error';
import CustomSpinner from '../../../../components/UI/CustomSpinner/CustomSpinner';
import List from '../../../../components/Backend/UI/List/List';
import Delete from '../../../../components/Backend/UI/Delete/Delete';

import * as actions from '../../../../store/actions';
import { updateObject, convertDate } from '../../../../shared/utility';

class Index extends Component {
    componentDidMount() {
        this.props.get();
    }

    componentWillUnmount() {
        this.props.reset();
    }

    render() {
        let { backend: { promotions: { loading, error, promotions, total } } } = this.props;
        let content = null;
        let errors = null;

        if (!promotions) promotions = [];

        let data = [];

        errors = <>
            <Error err={error} />
        </>;

        data = promotions.map(promotion => updateObject(promotion, {
            created_at: convertDate(promotion.created_at),
            start_time: convertDate(new Date(promotion.start_time)),
            end_time: convertDate(new Date(promotion.end_time)),
            status: promotion.status ?
                <Badge color="success" className="badge-block position-static"><FontAwesomeIcon icon={faCheckCircle} className="mr-2" fixedWidth />Active</Badge> :
                <Badge color="danger" className="badge-block position-static"><FontAwesomeIcon icon={faTimesCircle} className="mr-2" fixedWidth />Inactive</Badge>,
            action: <div className="text-center">
                <Link className="text-lightblue mr-2" to={"/admin/promotions/" + promotion.id}><FontAwesomeIcon icon={faEye} fixedWidth /></Link>
                <Link className="text-green mr-2" to={"/admin/promotions/" + promotion.id + "/edit"}><FontAwesomeIcon icon={faEdit} fixedWidth /></Link>
                <Delete deleteAction={() => this.props.delete(promotion.id)}><FontAwesomeIcon icon={faTrash} className="text-red" fixedWidth /></Delete>
            </div>
        }));

        content = (
            <>
                <Row>
                    <List loading={loading} array={data} data={JSON.stringify(promotions)} get={this.props.get} total={total} dark bordered icon={faThList} title="Promotion List" add="Add Promotion" link="/admin/promotions/add" innerClassName="bg-darkblue" className="bg-darklight shadow-sm"
                        fields={[
                            { name: 'Start Time', key: 'start_time' },
                            { name: 'End Time', key: 'end_time' },
                            { name: 'Status', key: 'status', minWidth: 125 },
                            { name: 'Action', key: 'action' }
                        ]} />
                </Row>
            </>
        );

        return (
            <>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main="Promotion List" icon={faUsers} />
                    <SpecialTitle user icon={faUsers}>Admin panel</SpecialTitle>
                    <Subtitle user>Promotion List</Subtitle>
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
    get: (page, show, search) => dispatch(actions.getPromotions(page, show, search)),
    delete: id => dispatch(actions.deletePromotions(id)),
    reset: () => dispatch(actions.resetPromotions()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));
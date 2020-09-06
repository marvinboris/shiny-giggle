import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Col, Row, Badge, ListGroup, ListGroupItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faUsers, faUserTie, faTimesCircle, faCheckCircle, faPrint, faEdit, faTrash, faSpinner, faBell, faShoppingCart, faMoneyBillWaveAlt, faPaperPlane, faTimes, faCheck, faThList } from '@fortawesome/free-solid-svg-icons';

// Components
import Breadcrumb from '../../../../../components/Backend/UI/Breadcrumb/Breadcrumb';
import SpecialTitle from '../../../../../components/UI/Titles/SpecialTitle/SpecialTitle';
import Subtitle from '../../../../../components/UI/Titles/Subtitle/Subtitle';
import Error from '../../../../../components/Error/Error';
import CustomSpinner from '../../../../../components/UI/CustomSpinner/CustomSpinner';
import List from '../../../../../components/Backend/UI/List/List';

import * as actions from '../../../../../store/actions';
import { convertDate, updateObject } from '../../../../../shared/utility';

class Index extends Component {
    componentDidMount() {
        const { get } = this.props;
        get();
    }

    render() {
        let { backend: { options: { loading, error, autoReinvests, total } }, auth: { data: { role } } } = this.props;
        let content = null;
        let errors = null;

        if (!autoReinvests) autoReinvests = [];

        let data = [];

        errors = <>
            <Error err={error} />
        </>;

        data = autoReinvests.map(autoReinvest => {
            return updateObject(autoReinvest, {
                start_date: convertDate(autoReinvest.start_date),
                created_at: convertDate(autoReinvest.created_at),
                status: autoReinvest.email_verified_at ?
                    <Badge color="success" className="badge-block position-static"><FontAwesomeIcon icon={faCheckCircle} className="mr-2" fixedWidth />Active</Badge> :
                    <Badge color="danger" className="badge-block position-static"><FontAwesomeIcon icon={faTimesCircle} className="mr-2" fixedWidth />Inactive</Badge>,
                action: <div className="text-center">
                    <Link className="text-lightblue mr-2" to={`/user/options/auto-reinvest/${autoReinvest.id}`}><FontAwesomeIcon icon={faEye} fixedWidth /></Link>
                </div>
            });
        });

        content = (
            <>
                <Row>
                    <List loading={loading} array={data} data={JSON.stringify(autoReinvests)} get={this.props.get} total={total} dark bordered icon={faThList} title="Auto Reinvest List" add="Auto Reinvest" link="/user/options/auto-reinvest/add" innerClassName="bg-darkblue" className="bg-darklight shadow-sm"
                        fields={[
                            { name: 'Creation Date', key: 'created_at' },
                            { name: 'Start Date', key: 'start_date' },
                            { name: 'Pack', key: 'pack' },
                            { name: 'Period', key: 'period' },
                            { name: 'Duration', key: 'duration' },
                            { name: 'Status', key: 'status', minWidth: 125 },
                            { name: 'Action', key: 'action' }
                        ]} />
                </Row>
            </>
        );

        return (
            <>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main="Auto Reinvest List" icon={faBell} />
                    <SpecialTitle user icon={faBell}><span className="text-capitalize">{(role || '')}</span> panel</SpecialTitle>
                    <Subtitle user>Auto Reinvest List</Subtitle>
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
    get: (page, show, search) => dispatch(actions.getAutoReinvests(page, show, search)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));
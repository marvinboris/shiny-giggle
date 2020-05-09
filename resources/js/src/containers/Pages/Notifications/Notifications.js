import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Col, Row, Badge, ListGroup, ListGroupItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faUsers, faUserTie, faTimesCircle, faCheckCircle, faPrint, faEdit, faTrash, faSpinner, faBell, faShoppingCart, faMoneyBillWaveAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

// Components
import Breadcrumb from '../../../components/Backend/UI/Breadcrumb/Breadcrumb';
import SpecialTitle from '../../../components/UI/Titles/SpecialTitle/SpecialTitle';
import Subtitle from '../../../components/UI/Titles/Subtitle/Subtitle';
import Error from '../../../components/Error/Error';
import CustomSpinner from '../../../components/UI/CustomSpinner/CustomSpinner';

import * as actions from '../../../store/actions';
import { convertDate } from '../../../shared/utility';

class Notifications extends Component {
    componentDidMount() {
        const { onGetNotifications } = this.props;
        onGetNotifications();
    }

    render() {
        let { backend: { notifications: { loading, error, notifications } }, auth: { data: { role } } } = this.props;
        let content = null;
        let errors = null;

        if (loading) content = <Col xs={12}>
            <CustomSpinner />
        </Col>;
        else {
            errors = <>
                <Error err={error} />
            </>;
            if (notifications) {
                const notificationsData = notifications.map(notification => {
                    let message, title, icon;
                    switch (notification.type) {
                        case 'App\\Notifications\\PlanUser':
                            title = 'Subscription';
                            icon = <FontAwesomeIcon className="text-success" size="2x" fixedWidth icon={faShoppingCart} />;
                            message = 'New plan bought.';
                            break;

                        case 'App\\Notifications\\Deposit':
                            title = 'Deposit';
                            icon = <FontAwesomeIcon className="text-primary" size="2x" fixedWidth icon={faMoneyBillWaveAlt} />;
                            message = 'Deposit successfully made.';
                            break;

                        case 'App\\Notifications\\LimoPayment':
                            title = 'Limo Payment';
                            icon = <FontAwesomeIcon className="text-yellow" size="2x" fixedWidth icon={faPaperPlane} />;
                            message = 'Limo Payment successfully submitted.';
                            break;

                        default:
                            break;
                    }

                    return <ListGroupItem color="darklight">
                        <Link to={"/notifications/" + notification.id} className="text-reset text-decoration-none">
                            <div className="d-flex align-items-center">
                                <div>{icon}</div>
                                <div className="pl-3">
                                    <h4>{title}</h4>
                                    {message}
                                </div>
                                <div className="ml-auto">{convertDate(notification.created_at)}</div>
                            </div>
                        </Link>
                    </ListGroupItem>;
                });

                content = (
                    <>
                        <ListGroup>
                            {notificationsData}
                        </ListGroup>
                    </>
                );
            }
        }

        return (
            <>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main="Notifications" icon={faBell} />
                    <SpecialTitle user icon={faBell}><span className="text-capitalize">{(role || '')}</span> panel</SpecialTitle>
                    <Subtitle user>Notifications</Subtitle>
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
    onGetNotifications: () => dispatch(actions.getNotifications()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Notifications));
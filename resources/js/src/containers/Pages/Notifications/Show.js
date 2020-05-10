import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Col, Row, Badge, ListGroup, ListGroupItem, Card, CardHeader, CardBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faUsers, faUserTie, faTimesCircle, faCheckCircle, faPrint, faEdit, faTrash, faSpinner, faBell, faShoppingCart, faMoneyBillWaveAlt, faPaperPlane, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

// Components
import Breadcrumb from '../../../components/Backend/UI/Breadcrumb/Breadcrumb';
import SpecialTitle from '../../../components/UI/Titles/SpecialTitle/SpecialTitle';
import Subtitle from '../../../components/UI/Titles/Subtitle/Subtitle';
import Error from '../../../components/Error/Error';
import CustomSpinner from '../../../components/UI/CustomSpinner/CustomSpinner';

import * as actions from '../../../store/actions';
import { convertDate } from '../../../shared/utility';

class Notification extends Component {
    componentDidMount() {
        const { onGetNotification } = this.props;
        onGetNotification(this.props.match.params.id);
    }

    render() {
        let { backend: { notifications: { loading, error, notification } }, auth: { data: { role, name, first_name, last_name } } } = this.props;
        let content = null;
        let errors = null;

        if (loading) content = <Col xs={12}>
            <CustomSpinner />
        </Col>;
        else {
            errors = <>
                <Error err={error} />
            </>;
            if (notification) {
                let message, title, icon, color;
                switch (notification.type) {
                    case 'App\\Notifications\\PlanUser':
                        title = 'Subscription';
                        color = 'success';
                        icon = <FontAwesomeIcon className={"text-" + color} size="2x" fixedWidth icon={faShoppingCart} />;
                        message = 'New plan bought.';
                        break;

                    case 'App\\Notifications\\Deposit':
                        title = 'Deposit';
                        color = 'primary';
                        icon = <FontAwesomeIcon className={"text-" + color} size="2x" fixedWidth icon={faMoneyBillWaveAlt} />;
                        message = 'Deposit successfully made.';
                        break;

                    case 'App\\Notifications\\LimoPayment':
                        title = 'Limo Payment';
                        color = 'yellow';
                        icon = <FontAwesomeIcon className={"text-" + color} size="2x" fixedWidth icon={faPaperPlane} />;
                        message = 'Limo Payment successfully submitted.';
                        break;

                    case 'App\\Notifications\\LimoPaymentStatus':
                        const { message: notificationMessage, status } = notification.data;
                        if (status === 1) {
                            title = 'Limo Payment Accepted';
                            icon = <FontAwesomeIcon className="text-green" size="2x" fixedWidth icon={faCheck} />;
                        } else if (status === 2) {
                            title = 'Limo Payment Cancelled';
                            icon = <FontAwesomeIcon className="text-danger" size="2x" fixedWidth icon={faTimes} />;
                        }
                        message = notificationMessage;
                        break;

                    default:
                        break;
                }

                content = <Card className="text-light bg-darklight">
                    <CardHeader className="d-flex align-items-center">
                        <div>{icon}</div>
                        <div className="pl-3">
                            <h4>{title}</h4>
                            {message}
                        </div>
                        <div className="ml-auto">
                            <Badge color={color} className="position-static">{title}</Badge>
                            <div className="ml-auto">{convertDate(notification.created_at)}</div>
                        </div>
                    </CardHeader>
                    <CardBody className="bg-darkblue-50">
                        <p>Hi, <span className="text-capitalize text-700">{name || first_name + ' ' + last_name}</span></p>
                        {message}
                    </CardBody>
                </Card>;
            }
        }

        return (
            <>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb items={[{ to: '/notifications', content: 'Notifications' }]} main="Notification Details" icon={faBell} />
                    <SpecialTitle user icon={faBell}><span className="text-capitalize">{(role || '')}</span> panel</SpecialTitle>
                    <Subtitle user>Notification Details</Subtitle>
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
    onGetNotification: id => dispatch(actions.getNotification(id)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Notification));
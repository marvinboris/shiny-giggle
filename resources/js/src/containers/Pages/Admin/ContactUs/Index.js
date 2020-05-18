import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Col, Row, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faUsers, faUserTie, faTimesCircle, faCheckCircle, faPrint, faEdit, faTrash, faSpinner, faFileArchive } from '@fortawesome/free-solid-svg-icons';

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
        const { onGetAdminContactUsList } = this.props;
        onGetAdminContactUsList();
    }

    render() {
        let { backend: { contactUs: { loading, error, contacts } } } = this.props;
        let content = null;
        let errors = null;

        if (loading) content = <Col xs={12}>
            <CustomSpinner />
        </Col>;
        else {
            errors = <>
                <Error err={error} />
            </>;
            if (contacts) {
                const contactsData = contacts.map(contact => {
                    const colors = ['yellow', 'success'];
                    const texts = ['Pending', 'Replied'];
                    const icons = [faSpinner, faCheckCircle];
                    const message = contact.message.length > 43 ? contact.message.substr(0, 40) + '...' : contact.message;
                    if (!contact.status) contact.status = 0;
                    return updateObject(contact, {
                        name: contact.user.first_name + ' ' + contact.user.last_name,
                        ref: contact.user.ref,
                        phone: contact.user.phone,
                        documents: <Badge color="primary" className="badge-block position-static"><FontAwesomeIcon icon={faFileArchive} className="text-orange mr-2" fixedWidth /> {contact.file ? 1 : 0} Document</Badge>,
                        created_at: convertDate(contact.created_at),
                        message,
                        status: <Badge color={colors[contact.status]} className="badge-block position-static"><FontAwesomeIcon icon={icons[contact.status]} className={contact.status === 0 ? 'fa-spin' : ''} fixedWidth /><span className="ml-2">{texts[contact.status]}</span></Badge>,
                        action: <div className="text-center">
                            <FontAwesomeIcon icon={faEye} className="text-lightblue mr-2" fixedWidth />
                            <FontAwesomeIcon icon={faPrint} className="text-green mr-2" fixedWidth />
                        </div>
                    });
                });

                content = (
                    <>
                        <Row>
                            <List array={contactsData} data={JSON.stringify(contacts)} dark bordered icon={faUserTie} title="Contact Us List" innerClassName="bg-darkblue" className="bg-darklight shadow-sm"
                                fields={[
                                    { name: 'Full Name', key: 'name' },
                                    { name: 'User ID', key: 'ref' },
                                    { name: 'Date', key: 'created_at' },
                                    { name: 'Title', key: 'title' },
                                    { name: 'Subject', key: 'subject' },
                                    { name: 'Content', key: 'message' },
                                    { name: 'Phone Number', key: 'phone' },
                                    { name: 'User Documents', key: 'documents', minWidth: 150 },
                                    { name: 'Status', key: 'status' },
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
                    <Breadcrumb main="Contact Us List" icon={faUserTie} />
                    <SpecialTitle user icon={faUserTie}>Admin panel</SpecialTitle>
                    <Subtitle user>Contact Us List</Subtitle>
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
    onGetAdminContactUsList: () => dispatch(actions.getAdminContactUsList()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));
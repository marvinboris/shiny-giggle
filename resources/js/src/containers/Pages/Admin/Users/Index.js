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
    state = {
        countries: []
    }

    async componentDidMount() {
        const { onGetAdminUsers } = this.props;
        onGetAdminUsers();
        const cors = 'https://cors-anywhere.herokuapp.com/';

        const phoneRes = await fetch(cors + 'http://country.io/phone.json', { method: 'GET', mode: 'cors' });
        const namesRes = await fetch(cors + 'http://country.io/names.json', { method: 'GET', mode: 'cors' });

        const phone = await phoneRes.json();
        const names = await namesRes.json();

        const countries = Object.keys(phone).map(key => ({ country: key, code: phone[key], name: names[key] })).sort((a, b) => a.country > b.country);

        this.setState({ countries });
    }

    render() {
        let { backend: { users: { loading, error, totalUsers } } } = this.props;
        const { countries } = this.state;
        let content = null;
        let errors = null;

        if (loading) content = <Col xs={12}>
            <CustomSpinner />
        </Col>;
        else {
            errors = <>
                <Error err={error} />
            </>;
            if (totalUsers) {
                const usersData = totalUsers.map(user => {
                    const country = countries.find(country => country.country === user.country);
                    return updateObject(user, {
                        name: user.first_name + ' ' + user.last_name,
                        created_at: convertDate(user.created_at),
                        last_login: convertDate(new Date(user.last_login)),
                        country: <div className="d-flex align-items-center">
                            <div className="border border-1 border-white rounded-circle overflow-hidden position-relative d-flex justify-content-center align-items-center mr-2" style={{ width: 20, height: 20 }}>
                                <span className={`flag-icon text-large position-absolute flag-icon-${user.country.toLowerCase()}`} />
                            </div>

                            {country ? country.name : null}
                        </div>,
                        status: user.email_verified_at ?
                            <Badge color="success" className="badge-block position-static"><FontAwesomeIcon icon={faCheckCircle} className="mr-2" fixedWidth />Active</Badge> :
                            <Badge color="danger" className="badge-block position-static"><FontAwesomeIcon icon={faTimesCircle} className="mr-2" fixedWidth />Inactive</Badge>,
                        action: <div className="text-center">
                            <Link className="text-lightblue mr-2" to={"/admin/users/" + user.id}><FontAwesomeIcon icon={faEye} fixedWidth /></Link>
                            <Link className="text-green mr-2" to={"/admin/users/" + user.id + "/edit"}><FontAwesomeIcon icon={faEdit} fixedWidth /></Link>
                            <Delete deleteAction={() => this.props.onPostAdminDeleteUser(user.id)}><FontAwesomeIcon icon={faTrash} className="text-red" fixedWidth /></Delete>
                        </div>
                    });
                });

                content = (
                    <>
                        <Row>
                            <List array={usersData} data={JSON.stringify(totalUsers)} dark bordered icon={faThList} title="User List" add="Add User" link="/admin/users/add" innerClassName="bg-darkblue" className="bg-darklight shadow-sm"
                                fields={[
                                    { name: 'Full Name', key: 'name' },
                                    // { name: 'Username', key: 'username' },
                                    { name: 'User ID', key: 'ref' },
                                    { name: 'Email', key: 'email' },
                                    { name: 'Phone', key: 'phone' },
                                    { name: 'Country', key: 'country' },
                                    { name: 'IP Address', key: 'ip' },
                                    { name: 'Creation Date', key: 'created_at' },
                                    { name: 'Last Login', key: 'last_login' },
                                    { name: 'Status', key: 'status', minWidth: 125 },
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
                    <Breadcrumb main="User List" icon={faUsers} />
                    <SpecialTitle user icon={faUsers}>Admin panel</SpecialTitle>
                    <Subtitle user>User List</Subtitle>
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
    onGetAdminUsers: () => dispatch(actions.getAdminUsers()),
    onPostAdminDeleteUser: id => dispatch(actions.postAdminDeleteUser(id))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));
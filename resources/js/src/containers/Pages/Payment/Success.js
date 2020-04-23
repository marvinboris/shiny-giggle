import React, { Component } from 'react'
import { Row, Col, Spinner, InputGroupText, InputGroupAddon, Input, InputGroup, FormGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faExclamationTriangle, faCopy, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';

import FrontEnd from '../../FrontEnd';

import Error from '../../../components/Error/Error';

import FormButton from '../../../components/UI/FormButton/FormButton';
import Title from '../../../components/UI/Title/Title';

import * as actions from '../../../store/actions/index';

class Subscribtion extends Component {
    componentDidMount() {
        this.props.onGetPlans();
    }

    clickHandler = () => {
        let { auth: { data: { role } } } = this.props;
        if (role === 'guest') this.props.history.push('/calculation');
        else if (role === 'user') this.props.history.push('/plans/select');
    }

    render() {
        let { payment: { loading, error, plans, links }, auth: { data: { role, plan_code } } } = this.props;

        let content = null;

        if (loading) content = <div className="py-5">
            <Spinner color="yellow" style={{ width: '15rem', height: '15rem' }} type="grow" />
        </div>;
        else {
            if (error) content = <div className="py-5">
                <Error err={error} />
            </div>;
            else content = <>
                <Title check style={{ width: '80%' }}>Thank you for your payment ! You may start using our service.</Title>

                <Row className="flex-fill align-items-center">
                    <Col xs={12}>
                        <div className="p-5 pb-4 rounded-4 border border-white-50 text-secondary text-left position-relative">
                            <div className="pt-5 position-absolute" style={{ top: 0, left: 0, transform: 'translateX(-50%)' }}>
                                <FontAwesomeIcon icon={faExclamationTriangle} className="text-lemongreen" size="2x" />
                            </div>

                            <div className="mb-5">
                                <span className="text-700 text-white">Hurray! Please take note</span>: This code is very Important when using our service.
                            You can use it to login, as well as use it multiple times unless it is expired. You
                            may copy, or save it in secure place. We will not be responsible if you lose
                            your code or misplace it. In case you forget your code, login using the
                            available options on login page.
                        </div>

                            <Row>
                                <Col xs={8}>
                                    <FormGroup>
                                        <InputGroup className="bg-white rounded-2" size="lg">
                                            <Input value={plan_code} className="bg-transparent text-center text-700 text-large border-0 text-small text-black h-100 px-4 py-3" readOnly />

                                            <InputGroupAddon addonType="append">
                                                <InputGroupText className="bg-transparent border-right-0 border-top-0 border-bottom-0 text-secondary text-small px-4">
                                                    <FontAwesomeIcon icon={faCopy} size="2x" className="text-lightblue" />
                                                </InputGroupText>
                                            </InputGroupAddon>

                                            <InputGroupAddon addonType="append">
                                                <InputGroupText className="bg-transparent border-right-0 border-top-0 border-bottom-0 text-secondary text-small px-4">
                                                    <FontAwesomeIcon icon={faDownload} size="2x" className="text-yellow" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </FormGroup>
                                </Col>

                                <Col xs={4} className="pl-0">
                                    <FormButton onClick={this.clickHandler} icon={faAngleDoubleRight} color="green">Start now</FormButton>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </>;
        }

        return (<FrontEnd>
            <Col xs={6} className="mx-auto flex-fill d-flex flex-column">
                {content}
            </Col>
        </FrontEnd>)
    }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onGetPlans: () => dispatch(actions.getPlans())
});

export default connect(mapStateToProps, mapDispatchToProps)(Subscribtion);
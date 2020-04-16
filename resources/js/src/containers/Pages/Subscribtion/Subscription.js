import React, { Component } from 'react'
import { Row, Col, Spinner } from 'reactstrap';
import { connect } from 'react-redux';

import PlanCard from '../../../components/UI/PlanCard/PlanCard';
import Error from '../../../components/Error/Error';
import Title from '../../../components/UI/Title/Title';

import mansee from '../../../assets/images/mansee.png';

import * as actions from '../../../store/actions/index';

class Subscribtion extends Component {
    componentDidMount() {
        this.props.onGetPlans();
    }

    render() {
        let { payment: { loading, error, plans, links } } = this.props;
        
        let content = null;

        if (loading) content = <div className="py-5">
            <Spinner color="yellow" style={{ width: '15rem', height: '15rem' }} type="grow" />
        </div>;
        else {
            if (plans && links) {
                plans = plans.map((plan, index) => ({
                    ...plan,
                    ...[{ color: 'light', chooseColor: 'yellow' }, { color: 'yellow', chooseColor: 'green' }, { color: 'yellow', chooseColor: 'green' }][index]
                }));
                plans[2].best = true;
                plans = [plans[0], plans[2], plans[1]];
                content = plans.map((plan, index) => <Col key={index} className="align-self-end" xs={4}>
                    <PlanCard {...plan} />
                </Col>);
            } else content = <div className="py-5">
                <Error err={error} />
            </div>;
        }
        
        return (
            <>
                <Title check>Good Job ! Welcome Mr John Doe. Please select a plan to get started</Title>

                <Row className="justify-content-between align-items-center flex-fill">
                    <Col xs={8} className="border-right border-border pr-5 py-5">
                        <Row className="justify-content-center align-items-center">
                            {content}
                        </Row>
                    </Col>
                    <Col xs={4}>
                        <img alt="mansee" src={mansee} className="img-fluid" />
                    </Col>
                </Row>
            </>
        )
    }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onGetPlans: () => dispatch(actions.getPlans())
});

export default connect(mapStateToProps, mapDispatchToProps)(Subscribtion);
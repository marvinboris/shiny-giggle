import React, { Component } from 'react'
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Row, Col, Form, FormGroup } from 'reactstrap'
import { Redirect } from 'react-router-dom';
import { faChevronLeft, faChevronRight, faWallet, faList, faCalendar, faBox, faClock, faAngleDoubleRight, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons'

import FrontEnd from '../../FrontEnd';

import ResultCard from "../../../components/UI/ResultCard";
import Title from '../../../components/UI/Title/Title';
import FormInput from '../../../components/UI/FormInput/FormInput';
import FormButton from '../../../components/UI/FormButton/FormButton';
import CustomSpinner from '../../../components/UI/CustomSpinner/CustomSpinner';

import * as actions from '../../../store/actions/index';

import './CalculationPage.css';

class CalculationPage extends Component {
    state = {
        packs: [],
        periods: [],
        durations: [],

        pageFirst: 1,
        pageSecond: 2,
        pageLast: 3,

        name: null,
        result: [],
        page: 1,
        newPeriods: [],

        pack: null,
        duration: null,
        period: null,
        packageAmount: null,

        simulation: null,

        points: null,

        selectedDuration: 'none',
        selectedPeriod: 'none',
        selectedReinvestment: '',
        selectedPack: 'none'
    }

    componentDidMount() {
        const { calculation: { selectedPlan }, auth: { data: { role } }, onGetCalculate, onGetCalculateFromCode } = this.props;
        if (role === 'guest') onGetCalculate();
        else if (role === 'user') onGetCalculateFromCode(selectedPlan);
    }

    componentWillUnmount() {
        const { auth: { data: { role, plan_id } }, exit, logout, setSelectedPlan } = this.props;
        const { points } = this.state;
        if (role === 'guest' && plan_id && points === 0) logout();
        else if (role === 'user') setSelectedPlan(null);
        exit();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { calculation: { simulation, data } } = nextProps;
        if ((simulation && !prevState.simulation) || (simulation && prevState.simulation && (simulation.points !== prevState.simulation.points))) {
            let result = [];

            const { leftPacksPerWeek } = simulation;

            let rem = 0
            leftPacksPerWeek.forEach(({ week, packs, balance, payouts, invest }, index) => {
                rem = (balance).toFixed(2);
                const payout = payouts.map((item) => '$' + item.toFixed(2));
                const balPrevW = (index === 0) ? 0 : leftPacksPerWeek[index - 1].balance;
                const totPayout = payouts.reduce((acc, val) => Number(acc) + Number(val)).toFixed(2);

                result.push(<ResultCard key={week + Math.random().toString()} random={Math.round(Math.random() * 1000000).toString()} week={week} payout={payout} balw={balance} balPrevW={balPrevW} totBal={balance + invest} totPayout={totPayout} invest={invest} rem={rem} bg="#73EC2" activePacks={packs} />);
            });

            return { ...prevState, result, simulation, points: simulation.points };
        }

        if (data.plan && prevState.packs.length === 0) {
            const { plan: { packs, periods, durations, name }, points } = data;
            return { ...prevState, packs, periods, durations, name, points };
        }
        return prevState;
    }

    inputChangeHandler = (e, name) => {
        const { packs, durations, periods } = this.state;
        const { value } = e.target;
        switch (name) {
            case "pack": this.setState({ newPeriods: periods.filter(item => item.id >= 7 - value), selectedPack: "$" + packs.find(({ id }) => id === +value).name, period: value });
                break;
            case "duration": this.setState({ selectedDuration: durations.find(({ id }) => id === +value).name, duration: value });
                break;
            case "period": this.setState({ selectedPeriod: periods.find(({ id }) => id === +value).name, period: value });
                break;
            default: break;
        }
    }

    submitHandler = e => {
        e.preventDefault();
        this.props.makeCalculation(e.target);
    }

    previousPageHandler = () => {
        let { page, pageFirst, pageLast, pageSecond } = this.state;
        if (page <= 1) return;
        page--;
        pageFirst--;
        pageSecond--;
        pageLast--;
        this.setState({ pageFirst, pageSecond, pageLast, page });
    }

    nextPageHandler = () => {
        let { page, result, pageFirst, pageLast, pageSecond } = this.state;
        if (page >= result.length / 8) return;
        page++;
        pageFirst++;
        pageSecond++;
        pageLast++;
        this.setState({ pageFirst, pageSecond, pageLast, page });
    }

    firstPageHandler = () => {
        const { page } = this.state;
        if (page <= 1) return;
        let pageFirst = 1, pageSecond = 2, pageLast = 3
        this.setState({ pageFirst, pageSecond, pageLast, page: 1 });
    }

    lastPageHandler = () => {
        let { page, result } = this.state;
        if (page >= result.length / 8) return;
        page = Math.ceil(result.length / 8);
        let pageFirst = page - 2,
            pageSecond = pageFirst + 1;
        this.setState({ pageFirst, pageSecond, pageLast: page, page });
    }

    pageChangeHandler = page => {
        let { pageFirst, pageSecond, pageLast, result } = this.state;
        const lastPage = Math.ceil(result.length / 8);
        if (page === 1) pageFirst = 1;
        else if (page === lastPage) pageFirst = lastPage - 2;
        else pageFirst = page - 1;
        pageSecond = pageFirst + 1;
        pageLast = pageSecond + 1;
        this.setState({ page, pageFirst, pageSecond, pageLast });
    }

    render() {
        const { calculation: { loading, simulation, selectedPlan }, auth: { data: { role, plan_id, plan_code, plans } } } = this.props;
        let { points, page, packs, newPeriods, durations, name, pageFirst, pageLast, pageSecond, pack, duration, period, selectedDuration, selectedPack, selectedPeriod, result } = this.state;

        let redirect;
        if (role === 'guest' && (!plan_id || (points === 0 && !simulation))) redirect = <Redirect to="/plans" />;
        else redirect = <Redirect to="/dashboard" />;

        if (result.length > 0) result = result.filter((r, i) => (i >= (page - 1) * 8) && (i < page * 8));
        packs = packs.map(({ id, name }) => <option key={id} value={id}>{name}</option>);
        newPeriods = newPeriods.map(({ id, name }) => <option key={id} value={id}>{name}</option>);
        durations = durations.map(({ id, name }) => <option key={id} value={id}>{name}</option>);

        let content = null;
        if (loading && packs.length > 0) content = <div className="pt-5"><CustomSpinner /></div>;
        else content = result.length > 0 ? <div className="flex-fill bg-white overflow-hidden d-flex flex-column rounded-lg px-5 pt-3">
            <div className="flex-fill" style={{ overflowY: 'auto' }}>
                <Row style={{ transform: 'scale(.8)', transformOrigin: 'center', margin: '-5% -10% -5% -10%' }}>
                    {result}
                </Row>
            </div>

            <Row>
                <Col className="text-left mt-4" xs={12}>
                    <div className="border-bottom pb-3 mb-3" style={{ fontFamily: 'Bahnschrift' }}>Balance after {simulation.leftPacksPerWeek.length < (8 * page) ? simulation.leftPacksPerWeek[simulation.leftPacksPerWeek.length - 1].week : simulation.leftPacksPerWeek[8 * page - 1].week} weeks of continuous investment : <strong className="text-green">${simulation.leftPacksPerWeek.length < (8 * page) ? simulation.leftPacksPerWeek[simulation.leftPacksPerWeek.length - 1].balance.toFixed(2) : simulation.leftPacksPerWeek[8 * page - 1].balance.toFixed(2)}</strong></div>
                </Col>
                <Col xs={12} className="d-flex">
                    <nav className="ml-auto">
                        <ul className="pagination btn-group">
                            <li className="btn btn-yellow" onClick={this.firstPageHandler}><FontAwesomeIcon icon={faAngleDoubleLeft} className="mr-2" />First</li>
                            <li className="btn btn-link text-secondary" onClick={this.previousPageHandler}><FontAwesomeIcon icon={faChevronLeft} /></li>
                            <li className={"btn btn-link text-" + (page === pageFirst ? 'black' : 'secondary')} onClick={() => this.pageChangeHandler(pageFirst)}>{pageFirst}</li>
                            <li className={"btn btn-link text-" + (page === pageSecond ? 'black' : 'secondary')} onClick={() => this.pageChangeHandler(pageSecond)}>{pageSecond}</li>
                            <li className={"btn btn-link text-" + (page === pageLast ? 'black' : 'secondary')} onClick={() => this.pageChangeHandler(pageLast)}>{pageLast}</li>
                            <li className="btn btn-link text-secondary" onClick={this.nextPageHandler}><FontAwesomeIcon icon={faChevronRight} /></li>
                            <li className="btn btn-lightblue" onClick={this.lastPageHandler}>Last<FontAwesomeIcon icon={faAngleDoubleRight} className="ml-2" /></li>
                        </ul>
                    </nav>
                </Col>
            </Row>
        </div> : <h3 className="text-white flex-fill d-flex justify-content-center align-items-center m-0">Your result will show in this area !</h3>;

        return <FrontEnd>
            <div className="h-100">
                {redirect}
                <Row className="py-5 align-items-center justify-content-between h-100">
                    <Col xs={4} className="border-right text-left border-border h-100 pb-5 pr-5">
                        <Title mt={4} className="w-100 text-white">Please fill the form below to get started</Title>

                        <div className="text-light mb-5 mt-4">You have <span className="text-yellow">{points}</span> Calculations remaining</div>

                        <div>
                            <Form onSubmit={this.submitHandler}>
                                <Row>
                                    <Col xs={{ size: 11 }} className="align-self-start w-50">
                                        <FormInput type="select" icon={faWallet} onChange={(e) => this.inputChangeHandler(e, "pack")} value={pack} name="pack" required>
                                            <option value={''}>Select a package</option>
                                            {packs}
                                        </FormInput>

                                        <FormInput type="select" icon={faCalendar} onChange={(e) => this.inputChangeHandler(e, "period")} value={period} name="period" required>
                                            <option value={''}>Select Reinvestment type</option>
                                            {newPeriods}
                                        </FormInput>

                                        <FormInput type="select" icon={faCalendar} onChange={(e) => this.inputChangeHandler(e, "duration")} value={duration} name="duration" required>
                                            <option value={''}>Select a duration</option>
                                            {durations}
                                        </FormInput>

                                        {role === 'user' ? <input type="hidden" name="code" value={selectedPlan} /> : null}

                                        <FormGroup className="mt-5">
                                            <FormButton color="yellow" icon={faAngleDoubleRight}>Calculate Investment</FormButton>
                                        </FormGroup>
                                    </Col>
                                </Row>

                            </Form>
                        </div>
                    </Col>

                    <Col xs={8} className="h-100 pl-5">
                        <div className="h-100 d-flex flex-column overflow-hidden">
                            <div style={{ fontFamily: 'Bahnschrift' }} className="bg-white rounded-lg  pt-4 pb-3 mb-3">
                                <Row className="justify-content-between text-left">
                                    <Col xs={3} className="ml-4 ">
                                        <h4>{name} <span role="img" aria-label="medal">🥇</span></h4>
                                        <h6>Code: {plan_code || selectedPlan}</h6>
                                    </Col>
                                    <Col xs={4}>
                                        <Row>
                                            <Col className="mb-1" xs={12}>
                                                <FontAwesomeIcon color="#F5A10E" icon={faBox} /> Your selected package: {selectedPack}
                                            </Col>
                                            <Col xs={12}>
                                                <FontAwesomeIcon color="#F5A10E" icon={faCalendar} /> Duration Selected : {selectedDuration}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col className="mb-3" xs={{ size: 4 }} >
                                        <div>
                                            <FontAwesomeIcon icon={faList} color="#F5A10E" /> Reinvestment Type : {selectedPeriod}
                                        </div>

                                        <div>
                                            <FontAwesomeIcon icon={faClock} color="#F5A10E" /> Calculations Left : <span className="text-danger">{points}</span>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            {content}
                        </div>
                    </Col>
                </Row>
            </div>
        </FrontEnd>;
    }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => {
    return {
        onGetCalculate: () => dispatch(actions.getCalculate()),
        onGetCalculateFromCode: code => dispatch(actions.getCalculateFromCode(code)),
        makeCalculation: data => dispatch(actions.makeCalculation(data)),
        exit: () => dispatch(actions.makeCalculationStart()),
        logout: () => dispatch(actions.authLogout()),
        setSelectedPlan: code => dispatch(actions.setSelectedPlan(code))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CalculationPage);
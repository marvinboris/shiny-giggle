import React, { Component } from 'react';
import { faCalendarAlt, faWallet, faCalendar, faAngleDoubleRight, faBox, faList, faClock, faAngleDoubleLeft, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Form, FormGroup } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactOwlCarousel from 'react-owl-carousel';

import BackEnd from '../../../BackEnd';

import Breadcrumb from '../../../../components/Backend/UI/Breadcrumb/Breadcrumb';
import SpecialTitle from '../../../../components/UI/Titles/SpecialTitle/SpecialTitle';
import Subtitle from '../../../../components/UI/Titles/Subtitle/Subtitle';
import UserPlan from '../../../../components/UI/Titles/UserPlan/UserPlan';
import Error from '../../../../components/Error/Error';
import CustomSpinner from '../../../../components/UI/CustomSpinner/CustomSpinner';
import FormInput from '../../../../components/UI/FormInput/FormInput';
import FormButton from '../../../../components/UI/FormButton/FormButton';
import ResultCard from '../../../../components/UI/ResultCard';

import * as actions from '../../../../store/actions';

class Calculate extends Component {
    divRef = React.createRef()

    state = {
        packs: [],
        periods: [],
        durations: [],

        pageFirst: 1,
        pageSecond: 2,
        pageLast: 3,

        name: null,
        code: null,
        result: [],
        page: 1,
        newPeriods: [],

        pack: null,
        duration: null,
        period: null,

        simulation: null,

        points: null,

        selectedDuration: 'none',
        selectedPeriod: 'none',
        selectedReinvestment: '',
        selectedPack: 'none'
    }



    componentDidMount() {
        this.props.onGetUserCalculatePlans();
    }

    componentWillUnmount() {
        const { setSelectedPlan, exit } = this.props;
        setSelectedPlan(null);
        exit();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { backend: { calculate: { plan } } } = nextProps;

        if (plan && plan.pivot.code !== prevState.code) {
            const { packs, periods, durations, name, pivot: { code, points } } = plan;
            return { ...prevState, packs, periods, durations, name, points, code };
        }
        return prevState;
    }



    clickHandler = code => {
        this.props.setSelectedPlan(code);
        this.props.onGetUserCalculatePlan(code);
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
        this.props.onResetSimulation();
    }

    submitHandler = e => {
        e.preventDefault();
        this.divRef.current.scrollTo(0, 0);
        this.props.onPostUserCalculate(e.target);
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
        let { page, pageFirst, pageLast, pageSecond } = this.state;
        const result = this.props.backend.calculate.simulation.leftPacksPerWeek;
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
        let { page } = this.state;
        const result = this.props.backend.calculate.simulation.leftPacksPerWeek;
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
        let { calculation: { selectedPlan }, backend: { calculate: { loading, error, plans, simulation } } } = this.props;
        let { points, page, packs, newPeriods, durations, name, pageFirst, pageLast, pageSecond, pack, duration, period, selectedDuration, selectedPack, selectedPeriod } = this.state;

        let content = '';
        packs = packs.map(({ id, name }) => <option key={id} value={id}>{name}</option>);
        newPeriods = newPeriods.map(({ id, name }) => <option key={id} value={id}>{name}</option>);
        durations = durations.map(({ id, name }) => <option key={id} value={id}>{name}</option>);

        let plansContent = null;
        if (loading && !plans) plansContent = <Col xs={12}>
            <CustomSpinner />
        </Col>;
        else if (plans) plansContent = <Col xs={12}>
            {/* <Row className="d-none d-sm-flex">
                {plans.map((plan, index) => <Col xs={4} className="p-0"><UserPlan key={index} onClick={() => this.clickHandler(plan.pivot.code)} hover selected={selectedPlan === plan.pivot.code} simulation={simulation} {...plan} /></Col>)}
            </Row> */}

            <Row>
                <Col xs={12} className="p-0">
                    <ReactOwlCarousel responsive={{ 0: { items: 1 }, 1100: { items: 2 }, 1550: { items: 3 } }} loop nav>
                        {plans.map((plan, index) => <UserPlan key={index} onClick={() => this.clickHandler(plan.pivot.code)} hover selected={selectedPlan === plan.pivot.code} simulation={simulation} {...plan} />)}
                    </ReactOwlCarousel>
                </Col>
            </Row>
        </Col>;

        let formContent = null;
        if (selectedPlan) formContent = <Col xs={12} className="pb-3 pt-sm-3">
            <Form onSubmit={this.submitHandler}>
                <Row className="align-items-center">
                    <FormInput type="select" className="col-xl-3" icon={faWallet} onChange={e => this.inputChangeHandler(e, "pack")} value={pack} name="pack" required>
                        <option>Select a package</option>
                        {packs}
                    </FormInput>

                    <FormInput type="select" className="col-xl-3" icon={faCalendar} onChange={e => this.inputChangeHandler(e, "period")} value={period} name="period" required>
                        <option>Select Reinvestment type</option>
                        {newPeriods}
                    </FormInput>

                    <FormInput type="select" className="col-xl-3" icon={faCalendar} onChange={e => this.inputChangeHandler(e, "duration")} value={duration} name="duration" required>
                        <option>Select a duration</option>
                        {durations}
                    </FormInput>

                    <input type="hidden" name="code" value={selectedPlan} />

                    <FormGroup className="col-xl-3 m-0">
                        <FormButton color="yellow" icon={faAngleDoubleRight}>Calculate Investment</FormButton>
                    </FormGroup>
                </Row>
            </Form>
        </Col>;

        let simulationContent = null;
        if (selectedPlan) {
            let result = [];

            if (simulation) {
                const { leftPacksPerWeek } = simulation;

                let rem = 0
                leftPacksPerWeek.forEach(({ week, packs, balance, payouts, invest }, index) => {
                    rem = (balance).toFixed(2);
                    const payout = payouts.map((item) => '$' + item.toFixed(2));
                    const balPrevW = (index === 0) ? 0 : leftPacksPerWeek[index - 1].balance;
                    const totPayout = payouts.reduce((acc, val) => Number(acc) + Number(val)).toFixed(2);

                    result.push(<ResultCard key={week + Math.random().toString()} random={Math.round(Math.random() * 1000000).toString()} week={week} payout={payout} balw={balance} balPrevW={balPrevW} totBal={balance + invest} totPayout={totPayout} invest={invest} rem={rem} bg="#73EC2" activePacks={packs} />);
                });

                points = simulation.points;
                result = result.filter((r, i) => (i >= (page - 1) * 8) && (i < page * 8));
            }

            let subContent = null;
            if (loading) subContent = <Col xs={12}>
                <CustomSpinner />
            </Col>;
            else if (result.length > 0) {
                subContent = <div className="h-100 d-flex flex-column flex-fill overflow-hidden">
                    <div className="d-none bg-white rounded-lg text-bahnschrift px-5 pb-3 mb-3">
                        <Row className="justify-content-between text-left">
                            <Col xs={3} className="ml-4 ">
                                <h4>{name} <span role="img" aria-label="medal">🥇</span></h4>
                                <h6>Code: {selectedPlan}</h6>
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
                            <Col className="mb-3" xs={4}>
                                <div>
                                    <FontAwesomeIcon icon={faList} color="#F5A10E" /> Reinvestment Type : {selectedPeriod}
                                </div>

                                <div>
                                    <FontAwesomeIcon icon={faClock} color="#F5A10E" /> Calculations Left : <span className="text-danger">{points}</span>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div className="flex-fill bg-white overflow-hidden d-flex flex-column rounded-lg px-5 pt-3">
                        <div className="flex-fill" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                            <Row
                            // style={{ transform: 'scale(.8)', transformOrigin: 'center', margin: '-5% -10% -5% -10%' }}
                            >
                                {result}
                            </Row>
                        </div>

                        <Row>
                            <Col className="text-left mt-4" xs={12}>
                                <div className="border-bottom pb-3 mb-3 text-bahnschrift">Balance after {simulation.leftPacksPerWeek.length < (8 * page) ? simulation.leftPacksPerWeek[simulation.leftPacksPerWeek.length - 1].week : simulation.leftPacksPerWeek[8 * page - 1].week} weeks of continuous investment : <strong className="text-green">${simulation.leftPacksPerWeek.length < (8 * page) ? simulation.leftPacksPerWeek[simulation.leftPacksPerWeek.length - 1].balance.toFixed(2) : simulation.leftPacksPerWeek[8 * page - 1].balance.toFixed(2)}</strong> approximately</div>
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
                    </div>
                </div>;
            } else subContent = <div className="text-x-large text-darkblue text-center text-700">Your result will show in this area</div>;

            simulationContent = <Col xs={12}>
                <div ref={this.divRef} className="embed-responsive embed-responsive-16by9 bg-white rounded-4 d-flex justify-content-center align-items-center">
                    {subContent}
                </div>
            </Col>;
        }

        if (error) content = <div className="py-5">
            <Error err={error} />
        </div>;
        else content = <Row>
            {plansContent}

            {formContent}

            {simulationContent}
        </Row>;

        return (
            <>
                <div className="bg-darklight py-4 pl-5 pr-4 position-relative">
                    <Breadcrumb main="Calculate" icon={faCalendarAlt} />
                    <SpecialTitle user icon={faCalendarAlt}>User panel</SpecialTitle>
                    <Subtitle user>Calculate</Subtitle>
                </div>
                <div className="p-4 pb-0">
                    <div className="pb-2 mb-5 border-bottom border-light text-light">
                        Purchased Plans
                        </div>
                    <h2 className="text-white mb-3">Choose a plan to get started</h2>

                    {content}
                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onGetUserCalculatePlans: () => dispatch(actions.getUserCalculatePlans()),
    onGetUserCalculatePlan: code => dispatch(actions.getUserCalculatePlan(code)),
    onPostUserCalculate: data => dispatch(actions.postUserCalculate(data)),
    exit: () => dispatch(actions.postUserCalculateStart()),
    onResetSimulation: () => dispatch(actions.resetSimulation()),
    logout: () => dispatch(actions.authLogout()),
    setSelectedPlan: code => dispatch(actions.setSelectedPlan(code)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Calculate));
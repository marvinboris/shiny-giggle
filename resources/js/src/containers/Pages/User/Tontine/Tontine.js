import React, { Component } from 'react';
import { faCalendarAlt, faWallet, faCalendar, faAngleDoubleRight, faBox, faList, faClock, faAngleDoubleLeft, faChevronLeft, faChevronRight, faSync, faUsers, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Form, FormGroup } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactOwlCarousel from 'react-owl-carousel';
import OwlCarousel from 'react-owl-carousel2';

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

class Tontine extends Component {
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
        members: '',
        amount: '',
        weeks: '',

        simulation: null,

        points: null,

        selectedDuration: 'none',
        selectedPeriod: 'none',
        selectedReinvestment: '',
        selectedPack: 'none',

        disabled: false,
    }



    componentDidMount() {
        this.props.onGetUserTontinePlans();
    }

    componentWillUnmount() {
        const { setSelectedPlan, onResetSimulation } = this.props;
        setSelectedPlan(null);
        onResetSimulation();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { backend: { tontine: { plan } } } = nextProps;

        if (plan && plan.pivot.code !== prevState.code) {
            const { packs, periods, durations, name, pivot: { code, points } } = plan;
            return { ...prevState, packs, periods, durations, name, points, code };
        }
        return prevState;
    }



    clickHandler = code => {
        this.props.setSelectedPlan(code);
        this.props.onGetUserTontinePlan(code);
    }

    inputChangeHandler = e => {
        const { packs, durations, periods } = this.state;
        const { value, name } = e.target;
        let amount, weeks, selectedPack;
        switch (name) {
            case "pack":
                selectedPack = packs.find(({ id }) => id === +value);
                amount = selectedPack.amount / this.state.members;
                weeks = Math.ceil(52 * 1.005 / selectedPack.rate);
                return this.setState({ newPeriods: periods.filter(item => item.id >= 7 - value), selectedPack: `$${selectedPack.name}`, pack: value, amount, weeks });
            case "duration":
                const selectedDuration = durations.find(({ id }) => id === +value).name;
                return this.setState({ selectedDuration, duration: value });
            case "period":
                const selectedPeriod = periods.find(({ id }) => id === +value).name;
                return this.setState({ selectedPeriod, period: value });
            case "members":
                selectedPack = packs.find(({ id }) => id === +this.state.pack);
                amount = selectedPack.amount / value;
                return this.setState({ members: value, amount });
            default:
                return this.setState({ [name]: value });
        }
    }

    submitHandler = e => {
        if (this.state.disabled) return location.reload();
        e.preventDefault();
        const scrollTop = document.getElementById('scroll-target').offsetTop;
        window.scroll(0, scrollTop);
        this.props.onPostUserTontine(e.target);
        this.setState({ disabled: true });
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
        const result = this.props.backend.tontine.simulation.leftPacksPerWeek;
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
        const result = this.props.backend.tontine.simulation.leftPacksPerWeek;
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
        let { calculation: { selectedPlan }, backend: { tontine: { loading, error, plans, simulation } } } = this.props;
        let {
            points, page, packs, newPeriods, durations, name,
            pageFirst, pageLast, pageSecond,
            pack, duration, period, members, amount, weeks,
            selectedDuration, selectedPack, selectedPeriod,
            disabled
        } = this.state;

        let content = '';
        packs = packs.map(({ id, name }) => <option key={id} value={id}>{name}</option>);
        newPeriods = newPeriods.map(({ id, name }) => <option key={id} value={id}>{name}</option>);
        durations = durations.map(({ id, name }) => <option key={id} value={id}>{name}</option>);

        let plansContent = null;
        if (loading && !plans) plansContent = <Col xs={12}>
            <CustomSpinner />
        </Col>;
        else if (plans) {
            const plansData = plans.map((plan, index) => <UserPlan key={index} onClick={() => this.clickHandler(plan.pivot.code)} hover selected={selectedPlan === plan.pivot.code} simulation={simulation} {...plan} />);
            plansContent = <Col xs={12}>
                <Row>
                    <Col xs={12} className="p-0">
                        <OwlCarousel ref="Plans" options={{ responsive: { 0: { items: 1 }, 1100: { items: 2 }, 1550: { items: 3 } }, loop: false, dots: false }}>
                            {plansData}
                        </OwlCarousel>
                    </Col>
                </Row>
            </Col>
        };

        let formContent = null;
        if (selectedPlan) formContent = <Col xs={12} className="pb-3 pt-sm-3">
            <Form id="scroll-target" onSubmit={this.submitHandler}>
                <Row className="align-items-center">
                    <Col xl={9}>
                        <Row>
                            <FormInput type="select" disabled={disabled} className="col-xl-4" icon={faWallet} onChange={this.inputChangeHandler} value={pack} name="pack" required>
                                <option>Select a package</option>
                                {packs}
                            </FormInput>

                            <FormInput type="number" disabled={disabled} className="col-xl-4" icon={faUsers} onChange={this.inputChangeHandler} value={members} name="members" placeholder="Number of members" required />

                            <FormInput type="number" disabled={disabled} className="col-xl-4" icon={faDollarSign} onChange={this.inputChangeHandler} value={amount} name="amount" placeholder="Amount per member" readonly />

                            <FormInput type="number" disabled={disabled} className="col-xl-4" icon={faCalendar} onChange={this.inputChangeHandler} value={weeks} name="weeks" placeholder="Necessary weeks" readonly />

                            <FormInput type="select" disabled={disabled} className="col-xl-4" icon={faCalendar} onChange={this.inputChangeHandler} value={period} name="period" required>
                                <option>Select Reinvestment type</option>
                                {newPeriods}
                            </FormInput>

                            <FormInput type="select" disabled={disabled} className="col-xl-4" icon={faCalendar} onChange={this.inputChangeHandler} value={duration} name="duration" required>
                                <option>Select a duration</option>
                                {durations}
                            </FormInput>
                        </Row>


                        <input type="hidden" name="code" value={selectedPlan} />
                    </Col>

                    <Col xl={3}>
                        <FormGroup className="m-0">
                            <FormButton color={disabled ? "green" : "yellow"} icon={disabled ? faSync : faAngleDoubleRight}>{disabled ? 'Reset Calculation' : 'Calculate Investment'}</FormButton>
                        </FormGroup>
                    </Col>
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

                    <div className="flex-fill bg-white overflow-hidden d-flex flex-column rounded-lg px-md-5 px-3 pt-3">
                        <div className="d-none d-md-block flex-fill" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                            <Row
                            // style={{ transform: 'scale(.8)', transformOrigin: 'center', margin: '-5% -10% -5% -10%' }}
                            >
                                {result}
                            </Row>
                        </div>

                        <div className="d-md-none flex-fill">
                            <OwlCarousel ref="Calculate" options={{ responsive: { 0: { items: 1 }, 600: { items: 2 } }, dots: false }}>
                                {result}
                            </OwlCarousel>
                        </div>

                        <Row>
                            <Col className="text-md-left text-center mt-4" xs={12}>
                                <div className="border-bottom pb-3 mb-3 text-bahnschrift">Balance after {simulation.leftPacksPerWeek.length < (8 * page) ? simulation.leftPacksPerWeek[simulation.leftPacksPerWeek.length - 1].week : simulation.leftPacksPerWeek[8 * page - 1].week} weeks of continuous investment : <strong className="text-green">${simulation.leftPacksPerWeek.length < (8 * page) ? simulation.leftPacksPerWeek[simulation.leftPacksPerWeek.length - 1].balance.toFixed(2) : simulation.leftPacksPerWeek[8 * page - 1].balance.toFixed(2)}</strong> approximately</div>
                            </Col>
                            <Col xs={12} className="d-flex justify-content-center">
                                <nav className="ml-md-auto">
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
            } else subContent = <div className="text-x-large text-darkblue my-5 py-5 my-md-0 py-md-0 text-center text-700">Your result will show in this area</div>;

            simulationContent = <Col xs={12}>
                <div className="embed-responsive embed-responsive-16by9 bg-white rounded-4 d-none d-md-flex justify-content-center align-items-center">
                    {subContent}
                </div>
                <div className="bg-white rounded-4 d-flex d-md-none justify-content-center align-items-center">
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
                    <Breadcrumb main="Tontine" icon={faUsers} />
                    <SpecialTitle user icon={faUsers}>User panel</SpecialTitle>
                    <Subtitle user>Tontine</Subtitle>
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
    onGetUserTontinePlans: () => dispatch(actions.getUserTontinePlans()),
    onGetUserTontinePlan: code => dispatch(actions.getUserTontinePlan(code)),
    onPostUserTontine: data => dispatch(actions.postUserTontine(data)),
    onResetSimulation: () => dispatch(actions.resetSimulation()),
    setSelectedPlan: code => dispatch(actions.setSelectedPlan(code)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Tontine));
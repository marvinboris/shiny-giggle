import React, { Component } from 'react';
import { Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faMedal, faCheck } from '@fortawesome/free-solid-svg-icons';

import './UserPlan.css';

export default class UserPlan extends Component {
    state = {
        animatedUsed: 0,
        animatedPercentage: 0
    }

    componentDidMount() {
        const { pivot: { points }, points: total } = this.props;

        const used = Math.max(total - points, 0);
        const percentage = (total - points) * 1000 / total;

        const duration = 500;

        for (let index = 0; index <= duration; index += 20) {
            setTimeout(() => {
                this.setState({ animatedUsed: Math.floor(used * index / duration), animatedPercentage: Math.floor(percentage * index / duration) });
            }, index);
        }
    }

    render() {
        const { name, price, pivot: { code, points }, slug, points: total, onClick, hover, selected } = this.props;
        const { animatedPercentage, animatedUsed } = this.state;
        const left = Math.min(points, total);
        let colors = { text: null, plan: null, card: null, price: null, used: null, left: null, pie: null, number: null, select: null, code: null, border: null };
        switch (slug) {
            case 'diamond-plan':
                colors = { text: 'secondary', plan: 'darkblue', card: 'white', price: 'darkblue', used: 'green', left: 'gray', pie: 'white', number: 'orange', select: 'green', code: 'orange', border: 'darkblue' };
                break;

            case 'gold-plan':
                colors = { text: 'white', plan: 'white', card: 'lightblue', price: 'white', used: 'darkblue', left: 'white', pie: 'transparent', number: 'white', select: 'orange', code: 'white', border: 'border' };
                break;

            case 'silver-plan':
                colors = { text: 'white', plan: 'light', card: 'darklight', price: 'orange', used: 'lightblue', left: 'light', pie: 'transparent', number: 'orange', select: 'lightblue', code: 'white', border: 'border' };
                break;

            default:
                break;
        }

        return <Col xl={4} lg={6} xs={12} className={`UserPlan position-relative ${selected ? 'selected' : ''} ${hover ? 'hover' : ''}`} style={selected ? { zIndex: 2 } : { zIndex: 1 }}>
            <div className="block position-relative">
                <div style={{ cursor: 'pointer' }} className={`main shadow rounded-4 pt-3 px-5 bg-${colors.card} text-${colors.text} d-flex flex-column position-relative overflow-hidden`}>
                    <div className="d-flex justify-content-between pb-2 border-bottom border-border">
                        <div className={`text-bahnschrift h4 m-0 text-${colors.plan}`}>{name} <FontAwesomeIcon icon={faMedal} /></div>

                        <div className={`text-700 text-${colors.price}`}>${price} Limo</div>
                    </div>

                    <FontAwesomeIcon icon={faCircle} className="text-darkblue position-absolute" size="3x" style={{ top: '50%', left: 0, transform: 'translate(-50%, -50%)' }} />
                    <FontAwesomeIcon icon={faCircle} className="text-darkblue position-absolute" size="3x" style={{ top: '50%', right: 0, transform: 'translate(50%, -50%)' }} />

                    <div className="flex-fill d-flex justify-content-center align-items-center position-relative" style={{ marginBottom: -8 }}>
                        <div className="position-absolute text-300 text-small text-left" style={{ left: 0, transform: 'translateY(-30px)' }}>
                            <div className="d-flex align-items-center"><FontAwesomeIcon icon={faCircle} className={`text-${colors.left} mr-1`} fixedWidth style={{ textShadow: '0 0 1px #6c757d' }} />Left</div>
                            <div className="d-flex align-items-center"><FontAwesomeIcon icon={faCircle} className={`text-${colors.used} mr-1`} fixedWidth style={{ textShadow: '0 0 1px #6c757d' }} />Used</div>
                        </div>

                        <div className={`w-50 embed-responsive embed-responsive-1by1 bg-${colors.card} position-relative`} style={{ top: -9, overflow: 'visible' }}>
                            <div className="Progress position-absolute" style={{ top: 'calc(50% - 16px)', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                <div className="set-size charts-container">
                                    <div className={`pie-wrapper progress-${animatedPercentage} style-2 rounded-circle bg-${colors.pie}`}>
                                        <span className="label"></span>
                                        <div className="pie">
                                            <div className={`left-side half-circle border-${colors.used}`}></div>
                                            <div className={`right-side half-circle border-${colors.used}`}></div>
                                        </div>
                                        <div className={`shadow border-${colors.left}`}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="position-absolute d-flex flex-column justify-content-center align-items-center" style={{ top: 'calc(50% - 16px)', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                <div className={`text-small text-${colors.code} text-700`}>{code}</div>

                                <div>
                                    <div className={`display-4 text-700 d-inline text-${colors.number} m-0 p-0`}>{animatedUsed}</div>
                                    <span className="text-x-small">/{total}</span>
                                </div>

                                <div className="text-x-small text-300">{left > 0 ? 'Calculations' : 'Completely'} used</div>
                            </div>
                        </div>
                    </div>
                </div>
                {hover ? <div className={`select rounded-4 position-absolute overflow-hidden w-100 h-100 d-flex justify-content-center align-items-center bg-light-80`} style={{ top: 0, left: 0 }}>

                    <FontAwesomeIcon icon={faCircle} className="text-darkblue position-absolute" size="3x" style={{ top: '50%', left: 0, transform: 'translate(-50%, -50%)' }} />
                    <FontAwesomeIcon icon={faCircle} className="text-darkblue position-absolute" size="3x" style={{ top: '50%', right: 0, transform: 'translate(50%, -50%)' }} />

                    <button type="button" className="btn btn-darklight rounded-2 px-4 btn-lg" onClick={onClick}>Select this plan</button>
                </div> : null}
            </div>
            {selected ? <span className="fa-stack fa-2x text-green position-absolute" style={{ top: 0, right: 16, transform: 'translate(50%, -50%)' }}>
                <FontAwesomeIcon icon={faCircle} className={`fa-stack-2x`} />
                <FontAwesomeIcon icon={faCheck} className={`fa-stack-1x fa-inverse`} />
            </span> : null}
        </Col>;
    }
}
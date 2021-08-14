import React from 'react';
import { Badge, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faWallet, faCalendar, faArrowAltCircleDown, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import View from '../Backend/UI/View/View';

export default ({ invest, payout, week, balPrevW, totPayout, totBal, totInv, rem, activePacks, packs, random }) => {
    const investCheck = invest > 0;
    let investText = '';
    if (investCheck) {
        let varInvest = invest;
        const boughtPacks = [];
        while (varInvest >= packs[0].amount) {
            const filteredPacks = packs.filter(pack => pack.amount <= varInvest);
            const mostExpensivePack = filteredPacks[filteredPacks.length - 1];

            boughtPacks.push(`$${mostExpensivePack.amount}`);
            varInvest -= mostExpensivePack.amount;
        }

        investText = <div className="d-inline-flex">
            <div className="pr-1">${invest}</div>

            <View title={`Bought packages: Week ${week}`} content={boughtPacks.join(" + ")}>
                <FontAwesomeIcon icon={faInfoCircle} />
            </View>
        </div>;
    }
    else {
        if (totBal > 200) investText = "Don't invest yet";
        else investText = "Can't invest";
    }

    return <Col className="mt-3" md={3}>
        <div style={{ backgroundColor: invest ? '#73EFC2' : '#EFECEC' }} className="h-100 text-left p-2 rounded-sm">
            <div style={{ backgroundColor: invest ? '#05C945' : '#F5A10E' }} className="py-1 pl-3 text-left w-100 rounded-sm d-flex align-items-center font-weight-bold"><FontAwesomeIcon size="2x" icon={faCalendar} className="pr-3" />Week {week}</div>

            <div className="d-flex align-items-center pt-2 pr-1">
                <div className="text-nowrap">Total Payout:</div>
                <div className="text-truncate text-montserrat pl-1">{payout.join(" + ")}</div>
                <div className="text-dark ml-auto">
                    <View title={`Payouts: Week ${week} - $${totPayout} total payout`} content={<div className="text-justify">{payout.join(" + ")}</div>}>
                        <FontAwesomeIcon icon={faArrowAltCircleDown} />
                    </View>
                </div>
            </div>

            <div className="pt-2 text-truncate">Bal W{week}: <strong className="text-montserrat">${balPrevW.toFixed(2)} + <span style={{ color: '#039B54' }}>${totPayout}</span></strong></div>

            <div className="pt-2">Total Bal: <strong className="text-montserrat">${totBal.toFixed(2)}</strong></div>

            <div className="pt-2">Total Inv: <strong className="text-montserrat">${totInv.toFixed(2)}</strong></div>

            <div className="pt-2">Invest: <strong>{investText}</strong> </div>

            <div className="pt-2 pb-2">Rem: <strong className="text-montserrat" style={{ color: '#039B54' }}>${rem}</strong></div>

            <div style={{ backgroundColor: invest ? '#056424' : '#05C945' }} className="text-white rounded-sm py-1 pl-3 w-100 d-flex align-items-center">
                <FontAwesomeIcon icon={faWallet} className="pr-3 d-none" size="2x" /><span className="pr-3 font-weight-lighter">W{week} Bal :</span> <strong>${rem}</strong>
            </div>
            <hr />
            <div className="d-flex">
                <span>Total Packages:</span>

                <div className="text-dark ml-auto">
                    <View title={`Packages: Week ${week} - $${totPayout} total payout`} content={<div className="d-flex flex-wrap">
                        {activePacks.map(({ leftWeeks, pack: { amount } }) =>
                            <div key={week + Math.random().toString()}>
                                {leftWeeks > 0 ? <div className="position-relative pr-3">
                                    <FontAwesomeIcon className="" size="2x" color="#05C945" icon={faFolder} />
                                    <span className="position-absolute text-bahnschrift text-white text-x-small text-montserrat" style={{ top: 0, transform: 'translate(calc(-15px - 50%), 10px)', zIndex: 3 }}>{amount}</span>
                                    <Badge className="rounded-circle float-right" style={{ top: 0, transform: 'translateX(-1.5rem)', zIndex: 2 }} color="danger">-{leftWeeks - 1}</Badge>
                                </div> : ''}
                            </div>)}
                    </div>}>
                        <FontAwesomeIcon icon={faArrowAltCircleDown} id={'packs' + random} />
                    </View>
                </div>
            </div>

            <div className="d-flex text-truncate">
                {activePacks.map(({ leftWeeks, pack: { amount } }) =>
                    <div key={week + Math.random().toString()}>
                        {leftWeeks > 0 ? <div className="position-relative pr-3">
                            <FontAwesomeIcon className="" size="2x" color="#05C945" icon={faFolder} />
                            <span className="position-absolute text-white text-x-small text-montserrat" style={{ top: 0, transform: 'translate(calc(-15px - 50%), 10px)', zIndex: 3 }}>{amount}</span>
                            <Badge className="rounded-circle float-right" style={{ top: 0, transform: 'translateX(-1.5rem)', zIndex: 2 }} color="danger">{leftWeeks > 1 ? '-' : ''}{leftWeeks - 1}</Badge>
                        </div> : ''}
                    </div>)}
            </div>
        </div>
    </Col>;
}

import React, { useState } from 'react';
import { Badge, Col, Tooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faWallet, faCalendar, faArrowAltCircleDown } from '@fortawesome/free-solid-svg-icons';

export default function ResultCard({ invest, payout, week, balPrevW, totPayout, totBal, rem, activePacks, random }) {
    const investCheck = invest > 0;
    let investText = '';
    if (investCheck) investText = '$' + invest;
    else {
        if (totBal > 100) investText = "Don't invest yet";
        else investText = "Can't invest";
    }

    const [payoutsTooltipOpen, setPayoutsTooltipOpen] = useState(false);
    const [packsTooltipOpen, setPacksTooltipOpen] = useState(false);

    const payoutsToggle = () => setPayoutsTooltipOpen(!payoutsTooltipOpen);
    const packsToggle = () => setPacksTooltipOpen(!packsTooltipOpen);

    return <Col className="mt-3" xs={3}>
        <div style={{ backgroundColor: invest ? '#73EFC2' : '#EFECEC', fontFamily: 'Bahnschrift' }} className="h-100 text-left p-2 rounded-sm font-weight-lighter">
            <div style={{ backgroundColor: invest ? '#05C945' : '#F5A10E' }} className="py-1 pl-3 text-left w-100 rounded-sm d-flex align-items-center font-weight-bold"><FontAwesomeIcon size="2x" icon={faCalendar} className="pr-3" />Week {week}</div>

            <div className="d-flex align-items-center pt-2 pr-1">
                <div className="text-nowrap">Total Payout:</div>
                <div className="text-truncate pl-1">{payout.join(" + ")}</div>
                <FontAwesomeIcon icon={faArrowAltCircleDown} id={'payouts' + random} className="text-dark ml-auto" />
            </div>

            <Tooltip placement="bottom" isOpen={payoutsTooltipOpen} target={'payouts' + random} toggle={payoutsToggle}>
                <div className="text-justify">{payout.join(" + ")}</div>
            </Tooltip>

            <div className="pt-2 text-truncate">Bal W{week}: <strong>${balPrevW.toFixed(2)} + <span style={{ color: '#039B54' }}>${totPayout}</span></strong></div>

            <div className="pt-2">Total Bal: <strong>${totBal.toFixed(2)}</strong></div>

            <div className="pt-2">Invest: <strong>{investText}</strong> </div>

            <div className="pt-2 pb-2">Rem: <strong style={{ color: '#039B54' }}>${rem}</strong></div>

            <div style={{ backgroundColor: invest ? '#056424' : '#05C945' }} className="text-white rounded-sm py-1 pl-3 w-100 d-flex align-items-center">
                <FontAwesomeIcon icon={faWallet} className="pr-3 d-none" size="2x" /><span className="pr-3 font-weight-lighter">W{week} Bal :</span> <strong>${rem}</strong>
            </div>
            <hr />
            <div className="d-flex">
                <span>Total Packages:</span>

                <FontAwesomeIcon icon={faArrowAltCircleDown} id={'packs' + random} className="text-dark ml-auto" />
            </div>

            <Tooltip placement="bottom" isOpen={packsTooltipOpen} target={'packs' + random} toggle={packsToggle}>
                <div className="d-flex flex-wrap">
                    {activePacks.map(({ leftWeeks, pack: { amount } }) =>
                        <div key={week + Math.random().toString()}>
                            {leftWeeks > 0 ? <div className="position-relative pr-3">
                                <FontAwesomeIcon className="" size="2x" color="#05C945" icon={faFolder} />
                                <span className="position-absolute text-bahnschrift text-white text-x-small" style={{ top: 0, transform: 'translate(calc(-15px - 50%), 10px)', zIndex: 3 }}>{amount}</span>
                                <Badge className="rounded-circle float-right" style={{ top: 0, transform: 'translateX(-1.5rem)', zIndex: 2 }} color="danger">-{leftWeeks - 1}</Badge>
                            </div> : ''}
                        </div>)}
                </div>
            </Tooltip>

            <div className="d-flex text-truncate">
                {activePacks.map(({ leftWeeks, pack: { amount } }) =>
                    <div key={week + Math.random().toString()}>
                        {leftWeeks > 0 ? <div className="position-relative pr-3">
                            <FontAwesomeIcon className="" size="2x" color="#05C945" icon={faFolder} />
                            <span className="position-absolute text-white text-x-small" style={{ top: 0, transform: 'translate(calc(-15px - 50%), 10px)', zIndex: 3 }}>{amount}</span>
                            <Badge className="rounded-circle float-right" style={{ top: 0, transform: 'translateX(-1.5rem)', zIndex: 2 }} color="danger">-{leftWeeks - 1}</Badge>
                        </div> : ''}
                    </div>)}
            </div>
        </div>
    </Col>;
}

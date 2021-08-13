import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faAngleDoubleRight, faCheckCircle, faStar } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

export default ({ name, slug, points, validity, price, best, color, chooseColor, durations, packs }) => <NavLink className="text-decoration-none text-left" to={`/plans/${slug}/payment/mobile`}>
    <div className={`rounded-4 shadow-sm bg-${best ? 'white' : 'darkgreen'} text-${best ? 'dark' : 'white'} px-1`}>
        <div className="border-bottom border-border py-3 px-4 d-flex justify-content-between align-items-end">
            <div className="position-relative">
                <div className="text-700">{name}</div>

                {best ?
                    <span className="bg-green rounded-2 py-1 px-2 text-white text-x-small">Best Plan</span>
                    :
                    <FontAwesomeIcon icon={faCircle} className={`text-${color} position-absolute`} size="sm" style={{ transform: 'translateX(-100%)', top: 0, left: -2 }} />
                }
            </div>

            {best ?
                <div>
                    <FontAwesomeIcon icon={faStar} className="text-yellow mr-2" fixedWidth size="2x" />

                    <span className={`text-700`}>${price} Limo</span>
                </div>
                :
                <div className={`text-700 text-${color}`}>${price} Limo</div>
            }
        </div>

        <div className="py-4 px-3 text-small">
            <div className="pb-2"><FontAwesomeIcon icon={faCheckCircle} className="text-green mr-2" fixedWidth />(01) Free trial calculation</div>
            <div className="pb-2"><FontAwesomeIcon icon={faCheckCircle} className="text-green mr-2" fixedWidth />{durations} Reinvestments periods</div>
            <div className="pb-2"><FontAwesomeIcon icon={faCheckCircle} className="text-green mr-2" fixedWidth />{packs} Packages</div>
            <div className="pb-2"><FontAwesomeIcon icon={faCheckCircle} className="text-green mr-2" fixedWidth />{points} Calculations only</div>
            <div className="pb-2"><FontAwesomeIcon icon={faCheckCircle} className="text-green mr-2" fixedWidth />{points} Points</div>
            {best ? <>
                <div className="pb-2"><FontAwesomeIcon icon={faCheckCircle} className="text-green mr-2" fixedWidth />Best available option <span className="text-danger text-x-small">(Coming soon)</span></div>
                <div className="pb-2"><FontAwesomeIcon icon={faCheckCircle} className="text-green mr-2" fixedWidth />Weekly Calculations</div>
            </> : null}
            <div className="pb-2"><FontAwesomeIcon icon={faCheckCircle} className="text-green mr-2" fixedWidth />{{ 2: '2 Weeks', 4: '1 Month', 10: '2 Months' }[validity]} validity</div>
        </div>

        <div className="border-top border-border py-3 px-4 text-center">
            <div className="position-relative text-700">
                Choose Plan
                <FontAwesomeIcon icon={faAngleDoubleRight} size="2x" className={`${!best ? 'text-' + chooseColor : ''} position-absolute`} style={{ right: 0, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
        </div>
    </div>
</NavLink>
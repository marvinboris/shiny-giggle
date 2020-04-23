import React from 'react';

import Image from '../../../assets/images/Group 13@2x.png';

export default ({ big }) => (
    <div className="NewLogo mb-0 text-center">
        <img src={Image} alt="NewLogo" style={big ? { width: 240 } : { width: 180 }} />
    </div>
);
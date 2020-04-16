import React from 'react';

import Image from '../../../assets/images/logo.png';

const NewLogo = ({ big }) => (
    <div className="NewLogo mb-0 text-center">
        <img src={Image} alt="NewLogo" style={big ? { width: 240 } : { width: 180 }} />
    </div>
);

export default NewLogo;
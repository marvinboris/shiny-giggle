import React from 'react';

const navDivider = ({ children }) => (
    <li className="nav-divider text-uppercase lead small text-light row d-block py-2" style={{ backgroundColor: 'rgba(0, 0, 0, .2)', padding: '0px 15px' }}>{children}</li>
);

export default navDivider;
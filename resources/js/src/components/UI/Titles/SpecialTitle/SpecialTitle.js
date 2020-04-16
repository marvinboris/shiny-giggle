import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const specialTitle = ({ icon, children, className, user }) => <div className={(user ? "text-large text-700 text-light " : "text-x-large mb-2") + " " + className}><FontAwesomeIcon icon={icon} className="mr-2 text-orange" size="sm" fixedWidth />{children}</div>;

export default specialTitle;
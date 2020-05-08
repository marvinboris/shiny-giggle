import React from 'react';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Title.css';

export default ({ children, className, style, check, mt = 5 }) => <div className={"mt-" + mt + " Title position-relative d-none d-sm-flex " + className} style={style}>
    {check ? <div className="pr-4">
        <FontAwesomeIcon icon={faCheckCircle} className="text-green" size="3x" />
    </div> : null}

    <h4 className="text-left text-white text-700 flex-fill overflow-hidden pb-3">
        {children}

        <div className="border-bottom border-border position-relative pt-3 mw-100" style={{ width: 613, maxWidth: '100%' }}>
            <div className="bg-yellow rounded-circle position-absolute" style={{ width: 20, height: 20, bottom: 0, left: 97.5, transform: 'translateY(50%)' }} />
        </div>
    </h4>
</div>;
import React from 'react';

const subtitle = ({ children, className, user }) => (
    <div>
        <div className={"text-muted " + (user ? 'pl-4 ml-0 text-white text-300 ' : '') + className}>{children}</div>
    </div>
);

export default subtitle;
import React from 'react';

export default ({ err }) => (err ? <div className="alert alert-danger">{err.message ? err.message : err}</div> : null);
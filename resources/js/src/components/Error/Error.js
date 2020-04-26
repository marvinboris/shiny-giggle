import React from 'react';

export default ({ err }) => (err && Object.keys(err).length > 0 ? <div className="alert alert-danger">{err.message ? err.message : err}</div> : null);
import React from 'react';
import { Spinner } from 'reactstrap';

export default () => <div className="py-5 my-1">
    <Spinner color="yellow" style={{ width: '15rem', height: '15rem' }} type="grow" className="my-2" />
</div>;
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import BackEnd from './BackEnd';
import FrontEnd from './FrontEnd';
import ErrorBoundary from './ErrorBoundary';

import './Pages.css';

class Layout extends Component {
    render() {
        const { children } = this.props;
        const url = window.location.pathname;

        let content = null;
        if (url.includes('auth/admin')) content = children;
        else if (url.includes('user') || url.includes('admin') || url.includes('dashboard')) content = <BackEnd>{children}</BackEnd>;
        else content = <FrontEnd>{children}</FrontEnd>;

        return <ErrorBoundary>
            {content}
        </ErrorBoundary>;
    }
};

const mapStateToProps = state => ({ ...state });

export default withRouter(connect(mapStateToProps)(Layout));
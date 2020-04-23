import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
    state = {
        error: null,
        errorInfo: null
    }

    componentDidCatch(error, errorInfo) {    // You can also log the error to an error reporting service    
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {      // You can render any custom fallback UI      
            return (
                <div>
                    <h2>Something went wrong.</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}
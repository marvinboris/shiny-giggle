import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import Toolbar from '../components/Backend/Navigation/Toolbar/Toolbar';
import SideDrawer from '../components/Backend/Navigation/SideDrawer/SideDrawer';
import CustomSpinner from '../components/UI/CustomSpinner/CustomSpinner';

import { authLogout } from '../store/actions';

class BackEnd extends Component {
    state = {
        isOpen: false,

        date: { weekDay: null, day: null, month: null, year: null },
        clock: { hours: null, minutes: null, seconds: null },

        interval: null
    }

    componentDidMount() {
        const interval = setInterval(() => {
            const date = new Date();
            const twoDigits = number => number < 10 ? '0' + number : number;

            const weekDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][date.getDay()];
            const day = date.getDate();
            const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
            const year = date.getFullYear();

            const hours = twoDigits(date.getHours());
            const minutes = twoDigits(date.getMinutes());
            const seconds = twoDigits(date.getSeconds());

            this.setState({ date: { weekDay, day, month, year }, clock: { hours, minutes, seconds } });
        }, 1000);
        this.setState({ interval });
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    logoutHandler = () => {
        const { onAuthLogout } = this.props;
        onAuthLogout();
    }

    toggle = () => {
        this.setState(prevState => ({ isOpen: !prevState.isOpen }));
    }

    render() {
        const { isOpen, date, clock } = this.state;
        const { auth: { loading, data: { notifications, first_name, last_name, name, role, photo, ref, sponsor, credits } }, onAuthLogout, children } = this.props;
        const isAuthenticated = localStorage.getItem('token') !== null;

        if (!isAuthenticated) onAuthLogout();

        return <div className="BackEnd text-left">
            <Toolbar notifications={notifications} name={name || first_name + ' ' + last_name} role={role} toggle={this.toggle} logoutHandler={this.logoutHandler} date={date} clock={clock} />
            <SideDrawer name={name || first_name + ' ' + last_name} isOpen={isOpen} photo={photo} role={role} id={ref} toggle={this.toggle} sponsor={sponsor} credits={credits} />

            <main className="bg-darkblue full-height-user position-relative pb-5">
                <div className="bg-darkblue mb-5 pb-5">
                    {loading ? <div className="h-100 d-flex justify-content-center align-items-center"><CustomSpinner /></div> : children}
                </div>

                <footer className="position-absolute d-none d-sm-block py-3 px-4 bg-darklight text-white">
                    <strong className="text-orange text-large">&copy;</strong> Copyright {new Date().getFullYear()} <strong><Link to="/" className="text-white">Liyeplimal Reinvestment System Calculator</Link></strong>. All rights reserved by <strong className="text-orange">Briluce Services</strong>. Developed by <strong className="text-lightblue">Code Items</strong>.
                </footer>
            </main>
        </div>;
    }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onAuthLogout: () => dispatch(authLogout())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BackEnd));
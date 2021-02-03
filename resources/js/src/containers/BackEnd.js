import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Toast, ToastHeader, ToastBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faMoneyBillWaveAlt, faPaperPlane, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

import Toolbar from '../components/Backend/Navigation/Toolbar/Toolbar';
import SideDrawer from '../components/Backend/Navigation/SideDrawer/SideDrawer';
import CustomSpinner from '../components/UI/CustomSpinner/CustomSpinner';

import { authLogout, authPhoto } from '../store/actions';

class BackEnd extends Component {
    state = {
        isOpen: false,

        date: { weekDay: null, day: null, month: null, year: null },
        clock: { hours: null, minutes: null, seconds: null },

        interval: null,

        selectedItem: '',
        notifications: null,
        messages: null,

        toast: null,
        toastShow: false,
    }

    static getDerivedStateToProps(nextProps, prevState) {
        if (nextProps.auth.data.notifications && !prevState.notifications) {
            const { notifications, messages } = nextProps.auth.data;
            return updateObject(prevState, { notifications, messages });
        }
        return prevState;
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

    componentDidUpdate(prevProps) {
        if (this.props.auth.data.notifications && !prevProps.auth.data.notifications) {
            const { token, data: { role, id } } = this.props.auth;
            Echo.connector.options.auth.headers['Authorization'] = token
            Echo.options.auth = {
                headers: {
                    Authorization: token,
                },
            };
            const channel = Echo.channel('public');
            channel.listen('MyNotifications', ({ user, notification, notifications }) => {
                if (user.role === role && user.id === id) {
                    const audio = new Audio('/audio/swiftly.mp3');
                    audio.play();

                    let message, title, icon;
                    switch (notification.type) {
                        case 'App\\Notifications\\PlanUser':
                            title = 'Subscription';
                            icon = <FontAwesomeIcon className="text-success" fixedWidth icon={faShoppingCart} />;
                            message = 'New plan bought.';
                            break;

                        case 'App\\Notifications\\Deposit':
                            title = 'Deposit';
                            icon = <FontAwesomeIcon className="text-primary" fixedWidth icon={faMoneyBillWaveAlt} />;
                            message = 'Deposit successfully made.';
                            break;

                        case 'App\\Notifications\\LimoPayment':
                            title = 'Limo Payment';
                            icon = <FontAwesomeIcon className="text-yellow" fixedWidth icon={faPaperPlane} />;
                            message = 'Limo Payment successfully submitted.';
                            break;

                        case 'App\\Notifications\\LimoPaymentStatus':
                            const { message: notificationMessage, status } = notification.data;
                            if (status === 1) {
                                title = 'Limo Payment Accepted';
                                icon = <FontAwesomeIcon className="text-green" fixedWidth icon={faCheck} />;
                            } else if (status === 2) {
                                title = 'Limo Payment Cancelled';
                                icon = <FontAwesomeIcon className="text-danger" fixedWidth icon={faTimes} />;
                            }
                            message = notificationMessage;
                            break;
                    }

                    const toast = {
                        title,
                        icon,
                        message
                    };
                    this.setState({ notifications, toast }, () => {
                        this.toastShow();
                        setTimeout(() => {
                            this.toastHide();
                        }, 5000);
                    });
                }
            });
            channel.listen('MyMessages', ({ user, message, messages }) => {
                if (user.role === role && user.id === id) {
                    const audio = new Audio('/audio/swiftly.mp3');
                    audio.play();
                    const toast = {
                        title: <span><strong>Message Update</strong></span>,
                        message: message.content
                    };
                    this.setState({ messages, toast }, () => {
                        this.toastShow();
                        setTimeout(() => {
                            this.toastHide();
                        }, 5000);
                    });
                }
            });
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    selectItem = item => this.setState({ selectedItem: item });

    logoutHandler = () => {
        const { onAuthLogout } = this.props;
        onAuthLogout();
    }

    toggle = () => {
        this.setState(prevState => ({ isOpen: !prevState.isOpen }));
    }

    toastShow = () => {
        this.setState({ toastShow: true });
    }

    toastHide = () => {
        this.setState({ toastShow: false });
    }

    toastToggle = () => {
        this.setState(prevState => ({ toastShow: !prevState.toastShow }));
    }

    render() {
        const { notifications, messages, toast, toastShow, isOpen, date, clock, selectedItem } = this.state;
        const { auth: { loading, data: { first_name, last_name, name, role, photo, ref, sponsor, credits } }, children } = this.props;

        return <div className="BackEnd text-left">
            <Toolbar notifications={notifications || []} messages={messages || []} name={name || first_name + ' ' + last_name} role={role} toggle={this.toggle} logoutHandler={this.logoutHandler} date={date} clock={clock} />
            <SideDrawer name={name || first_name + ' ' + last_name} messages={messages || []} isOpen={isOpen} photo={photo} role={role} id={ref} toggle={this.toggle} sponsor={sponsor} credits={credits} selectItem={this.selectItem} selectedItem={selectedItem} editPhoto={this.props.onAuthPhoto} />

            <main className="bg-darkblue full-height-user position-relative pb-5">
                <div className="bg-darkblue mb-5 pb-5">
                    {loading ? <div className="h-100 d-flex justify-content-center align-items-center"><CustomSpinner /></div> : children}
                </div>

                <footer className="position-absolute d-none d-sm-block py-3 px-4 bg-darklight text-white">
                    <strong className="text-orange text-large">&copy;</strong> Copyright {new Date().getFullYear()} <strong><Link to="/" className="text-white">Liyeplimal Reinvestment System Calculator</Link></strong>. All rights reserved by <strong className="text-orange">Limocalc</strong>. Developed by <strong className="text-lightblue">Briluce Services</strong>.
                </footer>
            </main>

            <div className="p-3 position-fixed Toast">
                {toast ? <Toast isOpen={toastShow}>
                    <ToastHeader toggle={this.toastToggle} icon={toast.icon}>{toast.title}</ToastHeader>
                    <ToastBody>
                        {toast.message}
                    </ToastBody>
                </Toast> : null}
            </div>
        </div>;
    }
}

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onAuthLogout: () => dispatch(authLogout()),
    onAuthPhoto: photo => dispatch(authPhoto(photo)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BackEnd));
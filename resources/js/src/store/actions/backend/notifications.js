import * as actionTypes from '../actionTypes';
import { rootPath } from '../../..';

export const resetNotifications = () => ({ type: actionTypes.RESET_NOTIFICATIONS });
const notificationsStart = () => ({ type: actionTypes.NOTIFICATIONS_START });
const notificationsSuccess = data => ({ type: actionTypes.NOTIFICATIONS_SUCCESS, ...data });
const notificationsFail = error => ({ type: actionTypes.NOTIFICATIONS_FAIL, error });
export const getNotifications = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(notificationsStart());

    try {
        const res = await fetch(`${rootPath}/notifications`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(notificationsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(notificationsFail(err));
    }
};

export const getNotification = id => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(notificationsStart());

    try {
        const res = await fetch(`${rootPath}/notifications/${id}`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(notificationsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(notificationsFail(err));
    }
};
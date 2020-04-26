import * as actionTypes from './actionTypes';
import { rootPath } from '../..';

export const getUserDashboardStart = () => ({ type: actionTypes.GET_USER_DASHBOARD_START });
const getUserDashboardSuccess = data => ({ type: actionTypes.GET_USER_DASHBOARD_SUCCESS, ...data });
const getUserDashboardFail = error => ({ type: actionTypes.GET_USER_DASHBOARD_FAIL, error });
export const getUserDashboard = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(getUserDashboardStart());

    try {
        const res = await fetch(rootPath + '/api/user/dashboard', {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(getUserDashboardSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(getUserDashboardFail(err));
    }
};



const getUserPackagesStart = () => ({ type: actionTypes.GET_USER_PACKAGES_START });
const getUserPackagesSuccess = data => ({ type: actionTypes.GET_USER_PACKAGES_SUCCESS, ...data });
const getUserPackagesFail = error => ({ type: actionTypes.GET_USER_PACKAGES_FAIL, error });
export const getUserPackages = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(getUserPackagesStart());

    try {
        const res = await fetch(rootPath + '/api/user/packages', {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(getUserPackagesSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(getUserPackagesFail(err));
    }
};



const getUserCalculatePlansStart = () => ({ type: actionTypes.GET_USER_CALCULATE_PLANS_START });
const getUserCalculatePlansSuccess = data => ({ type: actionTypes.GET_USER_CALCULATE_PLANS_SUCCESS, ...data });
const getUserCalculatePlansFail = error => ({ type: actionTypes.GET_USER_CALCULATE_PLANS_FAIL, error });
export const getUserCalculatePlans = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(getUserCalculatePlansStart());

    try {
        const res = await fetch(rootPath + '/api/user/calculate/plans', {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(getUserCalculatePlansSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(getUserCalculatePlansFail(err));
    }
};

const getUserCalculatePlanStart = () => ({ type: actionTypes.GET_USER_CALCULATE_PLAN_START });
const getUserCalculatePlanSuccess = data => ({ type: actionTypes.GET_USER_CALCULATE_PLAN_SUCCESS, ...data });
const getUserCalculatePlanFail = error => ({ type: actionTypes.GET_USER_CALCULATE_PLAN_FAIL, error });
export const getUserCalculatePlan = code => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(getUserCalculatePlanStart());

    try {
        const res = await fetch(rootPath + '/api/user/calculate/' + code, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(getUserCalculatePlanSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(getUserCalculatePlanFail(err));
    }
};

export const postUserCalculateStart = () => ({ type: actionTypes.POST_USER_CALCULATE_START });
const postUserCalculateSuccess = simulation => ({ type: actionTypes.POST_USER_CALCULATE_SUCCESS, simulation });
const postUserCalculateFail = error => ({ type: actionTypes.POST_USER_CALCULATE_FAIL, error });
export const postUserCalculate = data => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(postUserCalculateStart());

    try {
        const form = new FormData(data);

        const res = await fetch(rootPath + '/api/user/calculate', {
            method: 'POST',
            mode: 'cors',
            body: form,
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(postUserCalculateSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(postUserCalculateFail(err));
    }
};

export const resetSimulation = () => ({ type: actionTypes.RESET_SIMULATION });



const getUserNotificationsStart = () => ({ type: actionTypes.GET_USER_NOTIFICATIONS_START });
const getUserNotificationsSuccess = data => ({ type: actionTypes.GET_USER_NOTIFICATIONS_SUCCESS, ...data });
const getUserNotificationsFail = error => ({ type: actionTypes.GET_USER_NOTIFICATIONS_FAIL, error });
export const getUserNotifications = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(getUserNotificationsStart());

    try {
        const res = await fetch(rootPath + '/api/user/notifications', {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(getUserNotificationsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(getUserNotificationsFail(err));
    }
};

const getUserPaidAmountStart = () => ({ type: actionTypes.GET_USER_PAID_AMOUNT_START });
const getUserPaidAmountSuccess = data => ({ type: actionTypes.GET_USER_PAID_AMOUNT_SUCCESS, ...data });
const getUserPaidAmountFail = error => ({ type: actionTypes.GET_USER_PAID_AMOUNT_FAIL, error });
export const getUserPaidAmount = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(getUserPaidAmountStart());

    try {
        const res = await fetch(rootPath + '/api/user/paid-amount', {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(getUserPaidAmountSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(getUserPaidAmountFail(err));
    }
};
import * as actionTypes from './actionTypes';
import { rootPath } from '../..';

const getNotificationsStart = () => ({ type: actionTypes.GET_NOTIFICATIONS_START });
const getNotificationsSuccess = data => ({ type: actionTypes.GET_NOTIFICATIONS_SUCCESS, ...data });
const getNotificationsFail = error => ({ type: actionTypes.GET_NOTIFICATIONS_FAIL, error });
export const getNotifications = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(getNotificationsStart());

    try {
        const res = await fetch(rootPath + '/api/notifications', {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(getNotificationsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(getNotificationsFail(err));
    }
};

export const resetUserDashboard = () => ({ type: actionTypes.RESET_USER_DASHBOARD });
const getUserDashboardStart = () => ({ type: actionTypes.GET_USER_DASHBOARD_START });
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



export const resetUserPackages = () => ({ type: actionTypes.RESET_USER_PACKAGES });
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



export const resetUserCalculate = () => ({ type: actionTypes.RESET_USER_CALCULATE });
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



export const resetUserNotifications = () => ({ type: actionTypes.RESET_USER_NOTIFICATIONS });
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



// Admin
export const resetAdminDashboard = () => ({ type: actionTypes.RESET_ADMIN_DASHBOARD });
const getAdminDashboardStart = () => ({ type: actionTypes.GET_ADMIN_DASHBOARD_START });
const getAdminDashboardSuccess = data => ({ type: actionTypes.GET_ADMIN_DASHBOARD_SUCCESS, ...data });
const getAdminDashboardFail = error => ({ type: actionTypes.GET_ADMIN_DASHBOARD_FAIL, error });
export const getAdminDashboard = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(getAdminDashboardStart());

    try {
        const res = await fetch(rootPath + '/api/admin/dashboard', {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(getAdminDashboardSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(getAdminDashboardFail(err));
    }
};



export const resetAdminUsers = () => ({ type: actionTypes.RESET_ADMIN_USERS });
const getAdminUsersStart = () => ({ type: actionTypes.GET_ADMIN_USERS_START });
const getAdminUsersSuccess = data => ({ type: actionTypes.GET_ADMIN_USERS_SUCCESS, ...data });
const getAdminUsersFail = error => ({ type: actionTypes.GET_ADMIN_USERS_FAIL, error });
export const getAdminUsers = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(getAdminUsersStart());

    try {
        const res = await fetch(rootPath + '/api/admin/users', {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(getAdminUsersSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(getAdminUsersFail(err));
    }
};

const postAdminAddUserStart = () => ({ type: actionTypes.POST_ADMIN_ADD_USER_START });
const postAdminAddUserSuccess = message => ({ type: actionTypes.POST_ADMIN_ADD_USER_SUCCESS, message });
const postAdminAddUserFail = error => ({ type: actionTypes.POST_ADMIN_ADD_USER_FAIL, error });
export const postAdminAddUser = data => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(postAdminAddUserStart());

    try {
        const formData = new FormData(data);
        const res = await fetch(rootPath + '/api/admin/users', {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                Authorization: token
            }
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        dispatch(postAdminAddUserSuccess(resData.message));
    } catch (err) {
        console.log(err);
        dispatch(postAdminAddUserFail(err));
    }
};



export const resetAdminFinances = () => ({ type: actionTypes.RESET_ADMIN_FINANCES });
const getAdminSalesReportStart = () => ({ type: actionTypes.GET_ADMIN_SALES_REPORT_START });
const getAdminSalesReportSuccess = data => ({ type: actionTypes.GET_ADMIN_SALES_REPORT_SUCCESS, ...data });
const getAdminSalesReportFail = error => ({ type: actionTypes.GET_ADMIN_SALES_REPORT_FAIL, error });
export const getAdminSalesReport = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(getAdminSalesReportStart());

    try {
        const res = await fetch(rootPath + '/api/admin/finances/sales-report', {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(getAdminSalesReportSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(getAdminSalesReportFail(err));
    }
};

const getAdminLimoPaymentsStart = () => ({ type: actionTypes.GET_ADMIN_LIMO_PAYMENTS_START });
const getAdminLimoPaymentsSuccess = data => ({ type: actionTypes.GET_ADMIN_LIMO_PAYMENTS_SUCCESS, ...data });
const getAdminLimoPaymentsFail = error => ({ type: actionTypes.GET_ADMIN_LIMO_PAYMENTS_FAIL, error });
export const getAdminLimoPayments = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(getAdminLimoPaymentsStart());

    try {
        const res = await fetch(rootPath + '/api/admin/finances/limo-payments', {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(getAdminLimoPaymentsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(getAdminLimoPaymentsFail(err));
    }
};

const getAdminLimoPaymentStart = () => ({ type: actionTypes.GET_ADMIN_LIMO_PAYMENT_START });
const getAdminLimoPaymentSuccess = data => ({ type: actionTypes.GET_ADMIN_LIMO_PAYMENT_SUCCESS, ...data });
const getAdminLimoPaymentFail = error => ({ type: actionTypes.GET_ADMIN_LIMO_PAYMENT_FAIL, error });
export const getAdminLimoPayment = id => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(getAdminLimoPaymentStart());

    try {
        const res = await fetch(rootPath + '/api/admin/finances/limo-payments/' + id, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(getAdminLimoPaymentSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(getAdminLimoPaymentFail(err));
    }
};

const postAdminLimoPaymentStart = () => ({ type: actionTypes.POST_ADMIN_LIMO_PAYMENT_START });
const postAdminLimoPaymentSuccess = message => ({ type: actionTypes.POST_ADMIN_LIMO_PAYMENT_SUCCESS, message });
const postAdminLimoPaymentFail = error => ({ type: actionTypes.POST_ADMIN_LIMO_PAYMENT_FAIL, error });
export const postAdminLimoPayment = (id, data) => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(postAdminLimoPaymentStart());

    try {
        const formData = new FormData(data);
        const res = await fetch(rootPath + '/api/admin/finances/limo-payments/' + id, {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                Authorization: token
            }
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        dispatch(postAdminLimoPaymentSuccess(resData.message));
    } catch (err) {
        console.log(err);
        dispatch(postAdminLimoPaymentFail(err));
    }
};

const getAdminCreditsListStart = () => ({ type: actionTypes.GET_ADMIN_CREDITS_LIST_START });
const getAdminCreditsListSuccess = data => ({ type: actionTypes.GET_ADMIN_CREDITS_LIST_SUCCESS, ...data });
const getAdminCreditsListFail = error => ({ type: actionTypes.GET_ADMIN_CREDITS_LIST_FAIL, error });
export const getAdminCreditsList = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(getAdminCreditsListStart());

    try {
        const res = await fetch(rootPath + '/api/admin/finances/credits', {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(getAdminCreditsListSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(getAdminCreditsListFail(err));
    }
};

const postAdminAddCreditStart = () => ({ type: actionTypes.POST_ADMIN_ADD_CREDIT_START });
const postAdminAddCreditSuccess = message => ({ type: actionTypes.POST_ADMIN_ADD_CREDIT_SUCCESS, message });
const postAdminAddCreditFail = error => ({ type: actionTypes.POST_ADMIN_ADD_CREDIT_FAIL, error });
export const postAdminAddCredit = data => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(postAdminAddCreditStart());

    try {
        const formData = new FormData(data);
        const res = await fetch(rootPath + '/api/admin/finances/credits', {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                Authorization: token
            }
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        dispatch(postAdminAddCreditSuccess(resData.message));
    } catch (err) {
        console.log(err);
        dispatch(postAdminAddCreditFail(err));
    }
};



export const resetAdminPlans = () => ({ type: actionTypes.RESET_ADMIN_PLANS });
const getAdminPlansStart = () => ({ type: actionTypes.GET_ADMIN_PLANS_START });
const getAdminPlansSuccess = data => ({ type: actionTypes.GET_ADMIN_PLANS_SUCCESS, ...data });
const getAdminPlansFail = error => ({ type: actionTypes.GET_ADMIN_PLANS_FAIL, error });
export const getAdminPlans = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(getAdminPlansStart());

    try {
        const res = await fetch(rootPath + '/api/admin/plans', {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(getAdminPlansSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(getAdminPlansFail(err));
    }
};

const postAdminAddPlanStart = () => ({ type: actionTypes.POST_ADMIN_ADD_PLAN_START });
const postAdminAddPlanSuccess = message => ({ type: actionTypes.POST_ADMIN_ADD_PLAN_SUCCESS, message });
const postAdminAddPlanFail = error => ({ type: actionTypes.POST_ADMIN_ADD_PLAN_FAIL, error });
export const postAdminAddPlan = data => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(postAdminAddPlanStart());

    try {
        const formData = new FormData(data);
        const res = await fetch(rootPath + '/api/admin/plans', {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                Authorization: token
            }
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        dispatch(postAdminAddPlanSuccess(resData.message));
    } catch (err) {
        console.log(err);
        dispatch(postAdminAddPlanFail(err));
    }
};

const postAdminPlanDepositStart = () => ({ type: actionTypes.POST_ADMIN_PLAN_DEPOSIT_START });
const postAdminPlanDepositSuccess = message => ({ type: actionTypes.POST_ADMIN_PLAN_DEPOSIT_SUCCESS, message });
const postAdminPlanDepositFail = error => ({ type: actionTypes.POST_ADMIN_PLAN_DEPOSIT_FAIL, error });
export const postAdminPlanDeposit = data => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(postAdminPlanDepositStart());

    try {
        const formData = new FormData(data);
        const res = await fetch(rootPath + '/api/admin/plans/deposit', {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                Authorization: token
            }
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        dispatch(postAdminPlanDepositSuccess(resData.message));
    } catch (err) {
        console.log(err);
        dispatch(postAdminPlanDepositFail(err));
    }
};
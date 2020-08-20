import * as actionTypes from './actionTypes';
import { rootPath } from '../..';

export const resetNotifications = () => ({ type: actionTypes.RESET_NOTIFICATIONS });
const notificationsStart = () => ({ type: actionTypes.NOTIFICATIONS_START });
const notificationsSuccess = data => ({ type: actionTypes.NOTIFICATIONS_SUCCESS, ...data });
const notificationsFail = error => ({ type: actionTypes.NOTIFICATIONS_FAIL, error });
export const getNotifications = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(notificationsStart());

    try {
        const res = await fetch(`${rootPath}/api/notifications`, {
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
        const res = await fetch(`${rootPath}/api/notifications/${id}`, {
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

export const resetContactUs = () => ({ type: actionTypes.RESET_CONTACT_US });
const contactUsStart = () => ({ type: actionTypes.CONTACT_US_START });
const contactUsSuccess = data => ({ type: actionTypes.CONTACT_US_SUCCESS, ...data });
const contactUsFail = error => ({ type: actionTypes.CONTACT_US_FAIL, error });



// User
export const getUserContactUsList = (page = 1, show = 10, search = '') => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(contactUsStart());

    try {
        const res = await fetch(`${rootPath}/api/user/contact-us?page=${page}&show=${show}&search=${search}`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(contactUsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(contactUsFail(err));
    }
};

export const getUserContactUs = id => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(contactUsStart());

    try {
        const res = await fetch(`${rootPath}/api/user/contact-us/${id}`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(contactUsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(contactUsFail(err));
    }
};

export const postUserContactUs = data => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(contactUsStart());

    try {
        const form = new FormData(data);

        const res = await fetch(`${rootPath}/api/user/contact-us`, {
            method: 'POST',
            mode: 'cors',
            body: form,
            headers: {
                Authorization: token,
            }
        });
        const resData = await res.json();

        dispatch(contactUsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(contactUsFail(err));
    }
};



export const resetDashboard = () => ({ type: actionTypes.RESET_DASHBOARD });
const dashboardStart = () => ({ type: actionTypes.DASHBOARD_START });
const dashboardSuccess = data => ({ type: actionTypes.DASHBOARD_SUCCESS, ...data });
const dashboardFail = error => ({ type: actionTypes.DASHBOARD_FAIL, error });
export const getUserDashboard = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(dashboardStart());

    try {
        const res = await fetch(`${rootPath}/api/user/dashboard`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(dashboardSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(dashboardFail(err));
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
        const res = await fetch(`${rootPath}/api/user/packages`, {
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



export const resetSimulation = () => ({ type: actionTypes.RESET_SIMULATION });
export const resetCalculate = () => ({ type: actionTypes.RESET_CALCULATE });
const calculateStart = () => ({ type: actionTypes.CALCULATE_START });
const calculateSuccess = data => ({ type: actionTypes.CALCULATE_SUCCESS, ...data });
const calculateFail = error => ({ type: actionTypes.CALCULATE_FAIL, error });
export const getUserCalculatePlans = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(calculateStart());

    try {
        const res = await fetch(`${rootPath}/api/user/calculate/plans`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(calculateSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(calculateFail(err));
    }
};

export const getUserCalculatePlan = code => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(calculateStart());

    try {
        const res = await fetch(`${rootPath}/api/user/calculate/${code}`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(calculateSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(calculateFail(err));
    }
};

export const postUserCalculate = data => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(calculateStart());

    try {
        const form = new FormData(data);

        const res = await fetch(`${rootPath}/api/user/calculate`, {
            method: 'POST',
            mode: 'cors',
            body: form,
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(calculateSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(calculateFail(err));
    }
};

const getUserPaidAmountStart = () => ({ type: actionTypes.GET_USER_PAID_AMOUNT_START });
const getUserPaidAmountSuccess = data => ({ type: actionTypes.GET_USER_PAID_AMOUNT_SUCCESS, ...data });
const getUserPaidAmountFail = error => ({ type: actionTypes.GET_USER_PAID_AMOUNT_FAIL, error });
export const getUserPaidAmount = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(getUserPaidAmountStart());

    try {
        const res = await fetch(`${rootPath}/api/user/paid-amount`, {
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
export const getAdminDashboard = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(dashboardStart());

    try {
        const res = await fetch(`${rootPath}/api/admin/dashboard`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(dashboardSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(dashboardFail(err));
    }
};



export const resetUsers = () => ({ type: actionTypes.RESET_USERS });
const usersStart = () => ({ type: actionTypes.USERS_START });
const usersSuccess = data => ({ type: actionTypes.USERS_SUCCESS, ...data });
const usersFail = error => ({ type: actionTypes.USERS_FAIL, error });
export const getAdminUsers = (page = 1, show = 10, search = '') => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(usersStart());

    try {
        const res = await fetch(`${rootPath}/api/admin/users?page=${page}&show=${show}&search=${search}`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(usersSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(usersFail(err));
    }
};

export const getAdminUser = id => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(usersStart());

    try {
        const res = await fetch(`${rootPath}/api/admin/users/${id}`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(usersSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(usersFail(err));
    }
};

export const postAdminAddUser = data => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(usersStart());

    try {
        const formData = new FormData(data);
        const res = await fetch(`${rootPath}/api/admin/users`, {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                Authorization: token
            }
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        dispatch(usersSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(usersFail(err));
    }
};

export const postAdminEditUser = (id, data) => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(usersStart());

    try {
        const formData = new FormData(data);
        const res = await fetch(`${rootPath}/api/admin/users/${id}`, {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                Authorization: token
            }
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        dispatch(usersSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(usersFail(err));
    }
};

export const postAdminDeleteUser = (id, data) => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(usersStart());

    try {
        const formData = new FormData(data);
        const res = await fetch(`${rootPath}/api/admin/users/${id}/delete`, {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                Authorization: token
            }
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        dispatch(usersSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(usersFail(err));
    }
};



export const resetFinances = () => ({ type: actionTypes.RESET_FINANCES });
const financesStart = () => ({ type: actionTypes.FINANCES_START });
const financesSuccess = data => ({ type: actionTypes.FINANCES_SUCCESS, ...data });
const financesFail = error => ({ type: actionTypes.FINANCES_FAIL, error });
export const getAdminSalesReport = (page = 1, show = 10, search = '') => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(financesStart());

    try {
        const res = await fetch(`${rootPath}/api/admin/finances/sales-report?page=${page}&show=${show}&search=${search}`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(financesSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(financesFail(err));
    }
};

export const getAdminLimoPayments = (page = 1, show = 10, search = '') => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(financesStart());

    try {
        const res = await fetch(`${rootPath}/api/admin/finances/limo-payments?page=${page}&show=${show}&search=${search}`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(financesSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(financesFail(err));
    }
};

export const getAdminLimoPayment = id => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(financesStart());

    try {
        const res = await fetch(`${rootPath}/api/admin/finances/limo-payments/${id}`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(financesSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(financesFail(err));
    }
};

export const postAdminLimoPayment = (id, data) => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(financesStart());

    try {
        const formData = new FormData(data);
        const res = await fetch(`${rootPath}/api/admin/finances/limo-payments/${id}`, {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                Authorization: token
            }
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        dispatch(financesSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(financesFail(err));
    }
};

export const getAdminCreditsList = (page = 1, show = 10, search = '') => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(financesStart());

    try {
        const res = await fetch(`${rootPath}/api/admin/finances/credits?page=${page}&show=${show}&search=${search}`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(financesSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(financesFail(err));
    }
};

export const postAdminAddCredit = data => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(financesStart());

    try {
        const formData = new FormData(data);
        const res = await fetch(`${rootPath}/api/admin/finances/credits`, {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                Authorization: token
            }
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        dispatch(financesSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(financesFail(err));
    }
};



export const getAdminContactUsList = (page = 1, show = 10, search = '') => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(contactUsStart());

    try {
        const res = await fetch(`${rootPath}/api/admin/contact-us?page=${page}&show=${show}&search=${search}`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(contactUsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(contactUsFail(err));
    }
};

export const getAdminContactUs = id => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(contactUsStart());

    try {
        const res = await fetch(`${rootPath}/api/admin/contact-us/${id}`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(contactUsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(contactUsFail(err));
    }
};

export const postAdminEditContactUs = (id, data) => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(contactUsStart());

    try {
        const formData = new FormData(data);
        const res = await fetch(`${rootPath}/api/admin/contact-us/${id}`, {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                Authorization: token
            }
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        dispatch(contactUsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(contactUsFail(err));
    }
};

export const postAdminDeleteContactUs = (id, data) => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(contactUsStart());

    try {
        const formData = new FormData(data);
        const res = await fetch(`${rootPath}/api/admin/contact-us/${id}/delete`, {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                Authorization: token
            }
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        dispatch(contactUsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(contactUsFail(err));
    }
};



export const resetPlans = () => ({ type: actionTypes.RESET_PLANS });
const plansStart = () => ({ type: actionTypes.PLANS_START });
const plansSuccess = data => ({ type: actionTypes.PLANS_SUCCESS, ...data });
const plansFail = error => ({ type: actionTypes.PLANS_FAIL, error });
export const getAdminPlans = (page = 1, show = 10, search = '') => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(plansStart());

    try {
        const res = await fetch(`${rootPath}/api/admin/plans?page=${page}&show=${show}&search=${search}`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(plansSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(plansFail(err));
    }
};

export const getAdminPlanDetails = (page = 1, show = 10, search = '') => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(plansStart());

    try {
        const res = await fetch(`${rootPath}/api/admin/plans/details?page=${page}&show=${show}&search=${search}`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(plansSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(plansFail(err));
    }
};

export const postAdminAddPlan = data => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(plansStart());

    try {
        const formData = new FormData(data);
        const res = await fetch(`${rootPath}/api/admin/plans`, {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                Authorization: token
            }
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        dispatch(plansSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(plansFail(err));
    }
};

export const postAdminPlanDeposit = data => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(plansStart());

    try {
        const formData = new FormData(data);
        const res = await fetch(`${rootPath}/api/admin/plans/deposit`, {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                Authorization: token
            }
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        dispatch(plansSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(plansFail(err));
    }
};

export const postAdminCalculationsDeposit = data => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(plansStart());

    try {
        const formData = new FormData(data);
        const res = await fetch(`${rootPath}/api/admin/plans/calculations`, {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                Authorization: token
            }
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        dispatch(plansSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(plansFail(err));
    }
};
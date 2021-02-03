import * as actionTypes from '../actionTypes';
import { rootPath } from '../../..';

export const resetPlans = () => ({ type: actionTypes.RESET_PLANS });
const plansStart = () => ({ type: actionTypes.PLANS_START });
const plansSuccess = data => ({ type: actionTypes.PLANS_SUCCESS, ...data });
const plansFail = error => ({ type: actionTypes.PLANS_FAIL, error });
export const getAdminPlans = (page = 1, show = 10, search = '') => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(plansStart());

    try {
        const res = await fetch(`${rootPath}/admin/plans?page=${page}&show=${show}&search=${search}`, {
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
        const res = await fetch(`${rootPath}/admin/plans/details?page=${page}&show=${show}&search=${search}`, {
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
        const res = await fetch(`${rootPath}/admin/plans`, {
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
        const res = await fetch(`${rootPath}/admin/plans/deposit`, {
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

export const postAdminPlanBroadcast = data => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(plansStart());

    try {
        const formData = new FormData(data);
        const res = await fetch(`${rootPath}/admin/plans/broadcast`, {
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
        const res = await fetch(`${rootPath}/admin/plans/calculations`, {
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
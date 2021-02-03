import * as actionTypes from '../actionTypes';
import { rootPath } from '../../..';

export const resetFinances = () => ({ type: actionTypes.RESET_FINANCES });
const financesStart = () => ({ type: actionTypes.FINANCES_START });
const financesSuccess = data => ({ type: actionTypes.FINANCES_SUCCESS, ...data });
const financesFail = error => ({ type: actionTypes.FINANCES_FAIL, error });
export const getAdminSalesReport = (page = 1, show = 10, search = '') => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(financesStart());

    try {
        const res = await fetch(`${rootPath}/admin/finances/sales-report?page=${page}&show=${show}&search=${search}`, {
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
        const res = await fetch(`${rootPath}/admin/finances/limo-payments?page=${page}&show=${show}&search=${search}`, {
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
        const res = await fetch(`${rootPath}/admin/finances/limo-payments/${id}`, {
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
        const res = await fetch(`${rootPath}/admin/finances/limo-payments/${id}`, {
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
        const res = await fetch(`${rootPath}/admin/finances/credits?page=${page}&show=${show}&search=${search}`, {
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
        const res = await fetch(`${rootPath}/admin/finances/credits`, {
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
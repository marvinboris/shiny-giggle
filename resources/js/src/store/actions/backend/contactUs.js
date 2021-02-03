import * as actionTypes from '../actionTypes';
import { rootPath } from '../../..';

export const resetContactUs = () => ({ type: actionTypes.RESET_CONTACT_US });
const contactUsStart = () => ({ type: actionTypes.CONTACT_US_START });
const contactUsSuccess = data => ({ type: actionTypes.CONTACT_US_SUCCESS, ...data });
const contactUsFail = error => ({ type: actionTypes.CONTACT_US_FAIL, error });

// User
export const getUserContactUsList = (page = 1, show = 10, search = '') => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(contactUsStart());

    try {
        const res = await fetch(`${rootPath}/user/contact-us?page=${page}&show=${show}&search=${search}`, {
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
        const res = await fetch(`${rootPath}/user/contact-us/${id}`, {
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

        const res = await fetch(`${rootPath}/user/contact-us`, {
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

// Admin
export const getAdminContactUsList = (page = 1, show = 10, search = '') => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(contactUsStart());

    try {
        const res = await fetch(`${rootPath}/admin/contact-us?page=${page}&show=${show}&search=${search}`, {
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
        const res = await fetch(`${rootPath}/admin/contact-us/${id}`, {
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
        const res = await fetch(`${rootPath}/admin/contact-us/${id}`, {
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
        const res = await fetch(`${rootPath}/admin/contact-us/${id}/delete`, {
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
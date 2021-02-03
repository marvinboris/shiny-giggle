import * as actionTypes from '../actionTypes';
import { rootPath } from '../../..';

export const resetUsers = () => ({ type: actionTypes.RESET_USERS });
const usersStart = () => ({ type: actionTypes.USERS_START });
const usersSuccess = data => ({ type: actionTypes.USERS_SUCCESS, ...data });
const usersFail = error => ({ type: actionTypes.USERS_FAIL, error });
export const getAdminUsers = (page = 1, show = 10, search = '') => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(usersStart());

    try {
        const res = await fetch(`${rootPath}/admin/users?page=${page}&show=${show}&search=${search}`, {
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
        const res = await fetch(`${rootPath}/admin/users/${id}`, {
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
        const res = await fetch(`${rootPath}/admin/users`, {
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
        const res = await fetch(`${rootPath}/admin/users/${id}`, {
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
        const res = await fetch(`${rootPath}/admin/users/${id}/delete`, {
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
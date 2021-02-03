import * as actionTypes from '../actionTypes';
import { rootPath } from '../../..';

export const resetPromotions = () => ({ type: actionTypes.RESET_PROMOTIONS });
const promotionsStart = () => ({ type: actionTypes.PROMOTIONS_START });
const promotionsSuccess = data => ({ type: actionTypes.PROMOTIONS_SUCCESS, ...data });
const promotionsFail = error => ({ type: actionTypes.PROMOTIONS_FAIL, error });
export const getPromotions = (page = 1, show = 10, search = '') => async (dispatch, getState) => {
    dispatch(promotionsStart());
    const { role } = getState().auth.data;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${rootPath}/${role}/promotions?page=${page}&show=${show}&search=${search}`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(promotionsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(promotionsFail(err));
    }
};

export const getPromotion = id => async (dispatch, getState) => {
    dispatch(promotionsStart());
    const { role } = getState().auth.data;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${rootPath}/${role}/promotions/${id}`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(promotionsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(promotionsFail(err));
    }
};

export const getPromotionsInfo = () => async (dispatch, getState) => {
    dispatch(promotionsStart());
    const { role } = getState().auth.data;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${rootPath}/${role}/promotions/info`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(promotionsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(promotionsFail(err));
    }
};

export const postPromotions = data => async (dispatch, getState) => {
    dispatch(promotionsStart());
    const { role } = getState().auth.data;

    try {
        const formData = new FormData(data);
        const token = localStorage.getItem('token');
        const res = await fetch(`${rootPath}/${role}/promotions`, {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                Authorization: token
            }
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        dispatch(promotionsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(promotionsFail(err));
    }
};

export const patchPromotions = (id, data) => async (dispatch, getState) => {
    dispatch(promotionsStart());
    const { role } = getState().auth.data;

    try {
        const formData = new FormData(data);
        const token = localStorage.getItem('token');
        const res = await fetch(`${rootPath}/${role}/promotions/${id}`, {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                Authorization: token
            }
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        dispatch(promotionsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(promotionsFail(err));
    }
};

export const deletePromotions = id => async (dispatch, getState) => {
    dispatch(promotionsStart());
    const { role } = getState().auth.data;

    try {
        const page = document.getElementById('table-page').value;
        const show = document.getElementById('table-show').value;
        const search = document.getElementById('table-search').value;

        const token = localStorage.getItem('token');
        const res = await fetch(`${rootPath}/${role}/promotions/${id}?page=${page}&show=${show}&search=${search}`, {
            method: 'DELETE',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));
        dispatch(promotionsSuccess(resData));
    } catch (error) {
        console.log(error);
        dispatch(promotionsFail(error));
    }
};
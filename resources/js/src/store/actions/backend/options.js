import * as actionTypes from '../actionTypes';
import { rootPath } from '../../..';

export const resetOptions = () => ({ type: actionTypes.RESET_OPTIONS });
const optionsStart = () => ({ type: actionTypes.OPTIONS_START });
const optionsSuccess = data => ({ type: actionTypes.OPTIONS_SUCCESS, ...data });
const optionsFail = error => ({ type: actionTypes.OPTIONS_FAIL, error });
export const getAutoReinvests = (page = 1, show = 10, search = '') => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(optionsStart());

    try {
        const res = await fetch(`${rootPath}/user/options/auto-reinvest?page=${page}&show=${show}&search=${search}`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(optionsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(optionsFail(err));
    }
};

export const getAutoReinvestInit = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(optionsStart());

    try {
        const res = await fetch(`${rootPath}/user/options/auto-reinvest/init`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(optionsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(optionsFail(err));
    }
};

export const getAutoReinvest = id => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(optionsStart());

    try {
        const res = await fetch(`${rootPath}/user/options/auto-reinvest/${id}`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(optionsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(optionsFail(err));
    }
};

export const postAutoReinvest = data => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(optionsStart());

    try {
        const formData = new FormData(data);
        const res = await fetch(`${rootPath}/user/options/auto-reinvest`, {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                Authorization: token
            }
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        dispatch(optionsSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(optionsFail(err));
    }
};
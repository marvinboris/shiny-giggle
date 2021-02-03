import * as actionTypes from '../actionTypes';
import { rootPath } from '../../..';

export const resetTontine = () => ({ type: actionTypes.RESET_TONTINE });
const tontineStart = () => ({ type: actionTypes.TONTINE_START });
const tontineSuccess = data => ({ type: actionTypes.TONTINE_SUCCESS, ...data });
const tontineFail = error => ({ type: actionTypes.TONTINE_FAIL, error });
export const getUserTontinePlans = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(tontineStart());

    try {
        const res = await fetch(`${rootPath}/user/tontine/plans`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(tontineSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(tontineFail(err));
    }
};

export const getUserTontinePlan = code => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(tontineStart());

    try {
        const res = await fetch(`${rootPath}/user/tontine/${code}`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(tontineSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(tontineFail(err));
    }
};

export const postUserTontine = data => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(tontineStart());

    try {
        const form = new FormData(data);

        const res = await fetch(`${rootPath}/user/tontine`, {
            method: 'POST',
            mode: 'cors',
            body: form,
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(tontineSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(tontineFail(err));
    }
};
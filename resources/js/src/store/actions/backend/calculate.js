import * as actionTypes from '../actionTypes';
import { rootPath } from '../../..';

export const resetCalculate = () => ({ type: actionTypes.RESET_CALCULATE });
const calculateStart = () => ({ type: actionTypes.CALCULATE_START });
const calculateSuccess = data => ({ type: actionTypes.CALCULATE_SUCCESS, ...data });
const calculateFail = error => ({ type: actionTypes.CALCULATE_FAIL, error });
export const getUserCalculatePlans = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(calculateStart());

    try {
        const res = await fetch(`${rootPath}/user/calculate/plans`, {
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
        const res = await fetch(`${rootPath}/user/calculate/${code}`, {
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

        const res = await fetch(`${rootPath}/user/calculate`, {
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
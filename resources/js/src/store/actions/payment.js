import * as actionTypes from './actionTypes';
import { rootPath } from '../..';

const getPlansStart = () => ({ type: actionTypes.GET_PLANS_START });
const getPlansSuccess = data => ({ type: actionTypes.GET_PLANS_SUCCESS, ...data });
const getPlansFail = error => ({ type: actionTypes.GET_PLANS_FAIL, error });
export const getPlans = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(getPlansStart());

    try {
        const res = await fetch(rootPath + '/api/plans', {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(getPlansSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(getPlansFail(err));
    }
};

const getPaymentInfoStart = () => ({ type: actionTypes.GET_PAYMENT_INFO_START });
const getPaymentInfoSuccess = data => ({ type: actionTypes.GET_PAYMENT_INFO_SUCCESS, ...data });
const getPaymentInfoFail = error => ({ type: actionTypes.GET_PAYMENT_INFO_FAIL, error });
export const getPaymentInfo = slug => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(getPaymentInfoStart());

    try {
        const res = await fetch(rootPath + `/api/plans/${slug}/payment`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(getPaymentInfoSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(getPaymentInfoFail(err));
    }
};

const postLimoPaymentStart = () => ({ type: actionTypes.POST_LIMO_PAYMENT_START });
const postLimoPaymentSuccess = message => ({ type: actionTypes.POST_LIMO_PAYMENT_SUCCESS, message });
const postLimoPaymentFail = error => ({ type: actionTypes.POST_LIMO_PAYMENT_FAIL, error });
export const postLimoPayment = data => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(postLimoPaymentStart());

    try {
        const formData = new FormData(data);
        const res = await fetch(rootPath + '/api/plans/payment/limo', {
            method: 'POST',
            mode: 'cors',
            body: formData,
            headers: {
                Authorization: token
            }
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        dispatch(postLimoPaymentSuccess(resData.message));
    } catch (err) {
        console.log(err);
        dispatch(postLimoPaymentFail(err));
    }
};
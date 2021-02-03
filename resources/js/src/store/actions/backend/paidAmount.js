import * as actionTypes from '../actionTypes';
import { rootPath } from '../../..';

const getUserPaidAmountStart = () => ({ type: actionTypes.GET_USER_PAID_AMOUNT_START });
const getUserPaidAmountSuccess = data => ({ type: actionTypes.GET_USER_PAID_AMOUNT_SUCCESS, ...data });
const getUserPaidAmountFail = error => ({ type: actionTypes.GET_USER_PAID_AMOUNT_FAIL, error });
export const getUserPaidAmount = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(getUserPaidAmountStart());

    try {
        const res = await fetch(`${rootPath}/user/paid-amount`, {
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
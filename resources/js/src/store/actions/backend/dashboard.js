import * as actionTypes from '../actionTypes';
import { rootPath } from '../../..';

export const resetDashboard = () => ({ type: actionTypes.RESET_DASHBOARD });
const dashboardStart = () => ({ type: actionTypes.DASHBOARD_START });
const dashboardSuccess = data => ({ type: actionTypes.DASHBOARD_SUCCESS, ...data });
const dashboardFail = error => ({ type: actionTypes.DASHBOARD_FAIL, error });
export const getUserDashboard = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(dashboardStart());

    try {
        const res = await fetch(`${rootPath}/user/dashboard`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(dashboardSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(dashboardFail(err));
    }
};

export const getAdminDashboard = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(dashboardStart());

    try {
        const res = await fetch(`${rootPath}/admin/dashboard`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(dashboardSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(dashboardFail(err));
    }
};
import * as actionTypes from '../actionTypes';
import { rootPath } from '../../..';

export const resetUserPackages = () => ({ type: actionTypes.RESET_USER_PACKAGES });
const getUserPackagesStart = () => ({ type: actionTypes.GET_USER_PACKAGES_START });
const getUserPackagesSuccess = data => ({ type: actionTypes.GET_USER_PACKAGES_SUCCESS, ...data });
const getUserPackagesFail = error => ({ type: actionTypes.GET_USER_PACKAGES_FAIL, error });
export const getUserPackages = () => async dispatch => {
    const token = localStorage.getItem('token');
    dispatch(getUserPackagesStart());

    try {
        const res = await fetch(`${rootPath}/user/packages`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        });
        const resData = await res.json();
        dispatch(getUserPackagesSuccess(resData));
    } catch (err) {
        console.log(err);
        dispatch(getUserPackagesFail(err));
    }
};



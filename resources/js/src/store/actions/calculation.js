import * as actionTypes from './actionTypes';
import { rootPath } from '../..';

export const setSelectedPlan = selectedPlan => ({
    type: actionTypes.SET_SELECTED_PLAN,
    selectedPlan
});

const getCalculateStart = () => ({
    type: actionTypes.GET_CALCULATE_START
});

const getCalculateSuccess = data => ({
    type: actionTypes.GET_CALCULATE_SUCCESS,
    data
});

const getCalculateFail = error => ({
    type: actionTypes.GET_CALCULATE_FAIL,
    error
});

export const getCalculate = () => dispatch => {
    dispatch(getCalculateStart());
    const token = localStorage.getItem('token');
    const link = `${rootPath}/calculate`;

    fetch(link, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
        .then(res => res.json())
        .then(data => dispatch(getCalculateSuccess(data)))
        .catch(err => dispatch(getCalculateFail(err)));
}

export const getCalculateFromCode = code => dispatch => {
    dispatch(getCalculateStart());
    const token = localStorage.getItem('token');
    const link = `${rootPath}/calculate/${code}`;

    fetch(link, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
        .then(res => res.json())
        .then(data => dispatch(getCalculateSuccess(data)))
        .catch(err => dispatch(getCalculateFail(err)));
}

const getUserPlansStart = () => ({
    type: actionTypes.GET_USER_PLANS_START
});

const getUserPlansSuccess = plans => ({
    type: actionTypes.GET_USER_PLANS_SUCCESS,
    plans
});

const getUserPlansFail = error => ({
    type: actionTypes.GET_USER_PLANS_FAIL,
    error
});

export const getUserPlans = () => dispatch => {
    dispatch(getUserPlansStart());
    const token = localStorage.getItem('token');
    const link = `${rootPath}/user/plans`;

    fetch(link, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
        .then(res => res.json())
        .then(data => dispatch(getUserPlansSuccess(data)))
        .catch(err => dispatch(getUserPlansFail(err)));
}

export const makeCalculationStart = () => ({
    type: actionTypes.MAKE_CALCULATION_START
});

const makeCalculationSuccess = simulation => ({
    type: actionTypes.MAKE_CALCULATION_SUCCESS,
    simulation
});

const makeCalculationFail = error => ({
    type: actionTypes.MAKE_CALCULATION_FAIL,
    error
});

export const makeCalculation = data => dispatch => {
    dispatch(makeCalculationStart());
    const token = localStorage.getItem('token');

    const form = new FormData(data);
    const link = `${rootPath}/calculate`;
    fetch(link, {
        method: 'POST',
        mode: 'cors',
        body: form,
        headers: {
            'Authorization': token
        }
    })
        .then(res => res.json())
        .then(resData => dispatch(makeCalculationSuccess(resData)))
        .catch(err => dispatch(makeCalculationFail(err)));
};
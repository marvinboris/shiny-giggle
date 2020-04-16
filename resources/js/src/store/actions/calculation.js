import * as actionTypes from './actionTypes';


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
    const link = "/invest-laravel/public/api/calculate";

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

const makeCalculationStart = () => ({
    type: actionTypes.MAKE_CALCULATION_START
});

const makeCalculationSuccess = data => ({
    type: actionTypes.MAKE_CALCULATION_SUCCESS,
    data
});

const makeCalculationFail = error => ({
    type: actionTypes.MAKE_CALCULATION_FAIL,
    error
});

export const makeCalculation = data => dispatch => {
    dispatch(makeCalculationStart());
    const token = localStorage.getItem('token');

    const form = new FormData(data);
    const link = "/invest-laravel/public/api/calculate";
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
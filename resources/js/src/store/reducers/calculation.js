import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    data: {},
    simulation: null,
    loading: false,
    error: null

};

const getCalculateStart = (state, action) => updateObject(state, { error: null, loading: true });

const getCalculateSuccess = (state, action) => updateObject(state, {
    data: action.data,
    error: null,
    loading: false
});

const getCalculateFail = (state, action) => updateObject(state, {
    error: action.error,
    loading: false
});

const makeCalculationStart = (state, action) => updateObject(state, { error: null, loading: true });

const makeCalculationSuccess = (state, action) => updateObject(state, {
    simulation: action.data,
    error: null,
    loading: false
});

const makeCalculationFail = (state, action) => updateObject(state, {
    error: action.error,
    loading: false
});

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_CALCULATE_START: return getCalculateStart(state, action);
        case actionTypes.GET_CALCULATE_SUCCESS: return getCalculateSuccess(state, action);
        case actionTypes.GET_CALCULATE_FAIL: return getCalculateFail(state, action);
        case actionTypes.MAKE_CALCULATION_START: return makeCalculationStart(state, action);
        case actionTypes.MAKE_CALCULATION_SUCCESS: return makeCalculationSuccess(state, action);
        case actionTypes.MAKE_CALCULATION_FAIL: return makeCalculationFail(state, action);

        default: return state;
    }
};

export default reducer;
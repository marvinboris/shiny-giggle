import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    data: {},
    simulation: null,
    loading: false,
    error: null,
    selectedPlan: null,
    plans: null
};

const setSelectedPlan = (state, action) => updateObject(state, { error: null, loading: false, ...action });

const getCalculateStart = (state, action) => updateObject(state, { error: null, loading: true, data: {} });

const getCalculateSuccess = (state, action) => updateObject(state, { error: null, loading: false, ...action });

const getCalculateFail = (state, action) => updateObject(state, { loading: false, ...action });

const getUserPlansStart = (state, action) => updateObject(state, { error: null, loading: true, plans: null });

const getUserPlansSuccess = (state, action) => updateObject(state, { error: null, loading: false, ...action });

const getUserPlansFail = (state, action) => updateObject(state, { loading: false, ...action });

const makeCalculationStart = (state, action) => updateObject(state, { error: null, loading: true, simulation: null });

const makeCalculationSuccess = (state, action) => updateObject(state, { error: null, loading: false, ...action });

const makeCalculationFail = (state, action) => updateObject(state, { loading: false, ...action });

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED_PLAN: return setSelectedPlan(state, action);
        case actionTypes.GET_CALCULATE_START: return getCalculateStart(state, action);
        case actionTypes.GET_CALCULATE_SUCCESS: return getCalculateSuccess(state, action);
        case actionTypes.GET_CALCULATE_FAIL: return getCalculateFail(state, action);
        case actionTypes.GET_USER_PLANS_START: return getUserPlansStart(state, action);
        case actionTypes.GET_USER_PLANS_SUCCESS: return getUserPlansSuccess(state, action);
        case actionTypes.GET_USER_PLANS_FAIL: return getUserPlansFail(state, action);
        case actionTypes.MAKE_CALCULATION_START: return makeCalculationStart(state, action);
        case actionTypes.MAKE_CALCULATION_SUCCESS: return makeCalculationSuccess(state, action);
        case actionTypes.MAKE_CALCULATION_FAIL: return makeCalculationFail(state, action);

        default: return state;
    }
};

export default reducer;
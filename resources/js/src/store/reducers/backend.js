import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    dashboard: {
        loading: false,
        error: null,
    },

    users: {
        loading: false,
        error: null
    },

    calculate: {
        loading: false,
        error: null
    },
    contactUs: {
        loading: false,
        error: null
    },
    notifications: {
        loading: false,
        error: null
    },
    subscriptionPlan: {
        loading: false,
        error: null
    },
    settings: {
        loading: false,
        error: null
    },
};

const getUserDashboardStart = (state, action) => updateObject(state, { dashboard: updateObject(state.dashboard, { loading: true }) });
const getUserDashboardSuccess = (state, action) => updateObject(state, { dashboard: updateObject(state.dashboard, { loading: false, error: null, ...action }) });
const getUserDashboardFail = (state, action) => updateObject(state, { dashboard: updateObject(state.dashboard, { loading: false, ...action }) });

const getUserCalculatePlansStart = (state, action) => updateObject(state, { calculate: updateObject(state.calculate, { loading: true }) });
const getUserCalculatePlansSuccess = (state, action) => updateObject(state, { calculate: updateObject(state.calculate, { loading: false, error: null, ...action }) });
const getUserCalculatePlansFail = (state, action) => updateObject(state, { calculate: updateObject(state.calculate, { loading: false, ...action }) });
const getUserCalculatePlanStart = (state, action) => updateObject(state, { calculate: updateObject(state.calculate, { loading: true }) });
const getUserCalculatePlanSuccess = (state, action) => updateObject(state, { calculate: updateObject(state.calculate, { loading: false, error: null, ...action }) });
const getUserCalculatePlanFail = (state, action) => updateObject(state, { calculate: updateObject(state.calculate, { loading: false, ...action }) });
const postUserCalculateStart = (state, action) => updateObject(state, { calculate: updateObject(state.calculate, { loading: true }) });
const postUserCalculateSuccess = (state, action) => updateObject(state, { calculate: updateObject(state.calculate, { loading: false, error: null, ...action }) });
const postUserCalculateFail = (state, action) => updateObject(state, { calculate: updateObject(state.calculate, { loading: false, ...action }) });
const resetSimulation = (state, action) => updateObject(state, { calculate: updateObject(state.calculate, { simulation: null }) });




const getAdminDashboardStart = (state, action) => updateObject(state, { dashboard: updateObject(state.dashboard, { loading: true }) });
const getAdminDashboardSuccess = (state, action) => updateObject(state, { dashboard: updateObject(state.dashboard, { loading: false, error: null, ...action }) });
const getAdminDashboardFail = (state, action) => updateObject(state, { dashboard: updateObject(state.dashboard, { loading: false, ...action }) });

const getAdminUsersStart = (state, action) => updateObject(state, { users: updateObject(state.users, { loading: true }) });
const getAdminUsersSuccess = (state, action) => updateObject(state, { users: updateObject(state.users, { loading: false, error: null, ...action }) });
const getAdminUsersFail = (state, action) => updateObject(state, { users: updateObject(state.users, { loading: false, ...action }) });

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_USER_DASHBOARD_START: return getUserDashboardStart(state, action);
        case actionTypes.GET_USER_DASHBOARD_FAIL: return getUserDashboardFail(state, action);
        case actionTypes.GET_USER_DASHBOARD_SUCCESS: return getUserDashboardSuccess(state, action);
        
        case actionTypes.GET_USER_CALCULATE_PLANS_START: return getUserCalculatePlansStart(state, action);
        case actionTypes.GET_USER_CALCULATE_PLANS_FAIL: return getUserCalculatePlansFail(state, action);
        case actionTypes.GET_USER_CALCULATE_PLANS_SUCCESS: return getUserCalculatePlansSuccess(state, action);
        case actionTypes.GET_USER_CALCULATE_PLAN_START: return getUserCalculatePlanStart(state, action);
        case actionTypes.GET_USER_CALCULATE_PLAN_FAIL: return getUserCalculatePlanFail(state, action);
        case actionTypes.GET_USER_CALCULATE_PLAN_SUCCESS: return getUserCalculatePlanSuccess(state, action);
        case actionTypes.POST_USER_CALCULATE_START: return postUserCalculateStart(state, action);
        case actionTypes.POST_USER_CALCULATE_FAIL: return postUserCalculateFail(state, action);
        case actionTypes.POST_USER_CALCULATE_SUCCESS: return postUserCalculateSuccess(state, action);


        
        case actionTypes.GET_ADMIN_DASHBOARD_START: return getAdminDashboardStart(state, action);
        case actionTypes.GET_ADMIN_DASHBOARD_FAIL: return getAdminDashboardFail(state, action);
        case actionTypes.GET_ADMIN_DASHBOARD_SUCCESS: return getAdminDashboardSuccess(state, action);
        
        case actionTypes.GET_ADMIN_USERS_START: return getAdminUsersStart(state, action);
        case actionTypes.GET_ADMIN_USERS_FAIL: return getAdminUsersFail(state, action);
        case actionTypes.GET_ADMIN_USERS_SUCCESS: return getAdminUsersSuccess(state, action);

        default: return state;
    }
};

export default reducer;
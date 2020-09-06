import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    notifications: {
        loading: false,
        error: null
    },
    contactUs: {
        loading: false,
        error: null
    },
    dashboard: {
        loading: false,
        error: null,
    },

    users: {
        loading: false,
        error: null
    },
    finances: {
        loading: false,
        error: null
    },
    plans: {
        loading: false,
        error: null
    },

    calculate: {
        loading: false,
        error: null
    },
    subscriptionPlan: {
        loading: false,
        error: null
    },
    options: {
        loading: false,
        error: null
    },
    settings: {
        loading: false,
        error: null
    },
};



const resetNotifications = (state, action) => updateObject(state, { notifications: initialState.notifications });
const notificationsStart = (state, action) => updateObject(state, { notifications: updateObject(state.notifications, { loading: true, message: null }) });
const notificationsSuccess = (state, action) => updateObject(state, { notifications: updateObject(state.notifications, { loading: false, error: null, ...action }) });
const notificationsFail = (state, action) => updateObject(state, { notifications: updateObject(state.notifications, { loading: false, ...action }) });

const resetContactUs = (state, action) => updateObject(state, { contactUs: initialState.contactUs });
const contactUsStart = (state, action) => updateObject(state, { contactUs: updateObject(state.contactUs, { loading: true, message: null }) });
const contactUsSuccess = (state, action) => updateObject(state, { contactUs: updateObject(state.contactUs, { loading: false, error: null, ...action }) });
const contactUsFail = (state, action) => updateObject(state, { contactUs: updateObject(state.contactUs, { loading: false, ...action }) });

const resetDashboard = (state, action) => updateObject(state, { dashboard: initialState.dashboard });
const dashboardStart = (state, action) => updateObject(state, { dashboard: updateObject(state.dashboard, { loading: true, message: null }) });
const dashboardSuccess = (state, action) => updateObject(state, { dashboard: updateObject(state.dashboard, { loading: false, error: null, ...action }) });
const dashboardFail = (state, action) => updateObject(state, { dashboard: updateObject(state.dashboard, { loading: false, ...action }) });



const resetSimulation = (state, action) => updateObject(state, { calculate: updateObject(state.calculate, { simulation: null }) });
const resetCalculate = (state, action) => updateObject(state, { calculate: initialState.calculate });
const calculateStart = (state, action) => updateObject(state, { calculate: updateObject(state.calculate, { loading: true, message: null }) });
const calculateSuccess = (state, action) => updateObject(state, { calculate: updateObject(state.calculate, { loading: false, error: null, ...action }) });
const calculateFail = (state, action) => updateObject(state, { calculate: updateObject(state.calculate, { loading: false, ...action }) });

const resetOptions = (state, action) => updateObject(state, { options: initialState.options });
const optionsStart = (state, action) => updateObject(state, { options: updateObject(state.options, { loading: true, message: null }) });
const optionsSuccess = (state, action) => updateObject(state, { options: updateObject(state.options, { loading: false, error: null, ...action }) });
const optionsFail = (state, action) => updateObject(state, { options: updateObject(state.options, { loading: false, ...action }) });



const resetUsers = (state, action) => updateObject(state, { users: initialState.users });
const usersStart = (state, action) => updateObject(state, { users: updateObject(state.users, { loading: true, message: null }) });
const usersSuccess = (state, action) => updateObject(state, { users: updateObject(state.users, { loading: false, error: null, ...action }) });
const usersFail = (state, action) => updateObject(state, { users: updateObject(state.users, { loading: false, ...action }) });

const resetFinances = (state, action) => updateObject(state, { finances: initialState.finances });
const financesStart = (state, action) => updateObject(state, { finances: updateObject(state.finances, { loading: true, message: null }) });
const financesSuccess = (state, action) => updateObject(state, { finances: updateObject(state.finances, { loading: false, error: null, ...action }) });
const financesFail = (state, action) => updateObject(state, { finances: updateObject(state.finances, { loading: false, ...action }) });

const resetPlans = (state, action) => updateObject(state, { plans: initialState.plans });
const plansStart = (state, action) => updateObject(state, { plans: updateObject(state.plans, { loading: true, message: null }) });
const plansSuccess = (state, action) => updateObject(state, { plans: updateObject(state.plans, { loading: false, error: null, ...action }) });
const plansFail = (state, action) => updateObject(state, { plans: updateObject(state.plans, { loading: false, ...action }) });



const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.RESET_NOTIFICATIONS: return resetNotifications(state, action);
        case actionTypes.NOTIFICATIONS_START: return notificationsStart(state, action);
        case actionTypes.NOTIFICATIONS_FAIL: return notificationsFail(state, action);
        case actionTypes.NOTIFICATIONS_SUCCESS: return notificationsSuccess(state, action);

        case actionTypes.RESET_CONTACT_US: return resetContactUs(state, action);
        case actionTypes.CONTACT_US_START: return contactUsStart(state, action);
        case actionTypes.CONTACT_US_FAIL: return contactUsFail(state, action);
        case actionTypes.CONTACT_US_SUCCESS: return contactUsSuccess(state, action);

        case actionTypes.RESET_DASHBOARD: return resetDashboard(state, action);
        case actionTypes.DASHBOARD_START: return dashboardStart(state, action);
        case actionTypes.DASHBOARD_FAIL: return dashboardFail(state, action);
        case actionTypes.DASHBOARD_SUCCESS: return dashboardSuccess(state, action);



        case actionTypes.RESET_SIMULATION: return resetSimulation(state, action);
        case actionTypes.RESET_CALCULATE: return resetCalculate(state, action);
        case actionTypes.CALCULATE_START: return calculateStart(state, action);
        case actionTypes.CALCULATE_FAIL: return calculateFail(state, action);
        case actionTypes.CALCULATE_SUCCESS: return calculateSuccess(state, action);

        case actionTypes.RESET_OPTIONS: return resetOptions(state, action);
        case actionTypes.OPTIONS_START: return optionsStart(state, action);
        case actionTypes.OPTIONS_FAIL: return optionsFail(state, action);
        case actionTypes.OPTIONS_SUCCESS: return optionsSuccess(state, action);



        case actionTypes.RESET_USERS: return resetUsers(state, action);
        case actionTypes.USERS_START: return usersStart(state, action);
        case actionTypes.USERS_FAIL: return usersFail(state, action);
        case actionTypes.USERS_SUCCESS: return usersSuccess(state, action);

        case actionTypes.RESET_FINANCES: return resetFinances(state, action);
        case actionTypes.FINANCES_START: return financesStart(state, action);
        case actionTypes.FINANCES_FAIL: return financesFail(state, action);
        case actionTypes.FINANCES_SUCCESS: return financesSuccess(state, action);

        case actionTypes.RESET_PLANS: return resetPlans(state, action);
        case actionTypes.PLANS_START: return plansStart(state, action);
        case actionTypes.PLANS_FAIL: return plansFail(state, action);
        case actionTypes.PLANS_SUCCESS: return plansSuccess(state, action);

        default: return state;
    }
};

export default reducer;
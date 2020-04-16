import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState2 = {
    plans: null,
    links: null,
    plan: null,
    methods: null,
    loading: false,
    error: null
};

const getPlansStart = (state, action) => updateObject(state, { loading: true });

const getPlansSuccess = (state, action) => updateObject(state, { loading: false, error: null, ...action });

const getPlansFail = (state, action) => updateObject(state, { loading: false, ...action });

const getPaymentInfoStart = (state, action) => updateObject(state, { loading: true });

const getPaymentInfoSuccess = (state, action) => updateObject(state, { loading: false, error: null, ...action });

const getPaymentInfoFail = (state, action) => updateObject(state, { loading: false, ...action });

const reducer = (state = initialState2, action) => {
    switch (action.type) {
        case actionTypes.GET_PLANS_START: return getPlansStart(state, action);
        case actionTypes.GET_PLANS_FAIL: return getPlansFail(state, action);
        case actionTypes.GET_PLANS_SUCCESS: return getPlansSuccess(state, action);

        case actionTypes.GET_PAYMENT_INFO_START: return getPaymentInfoStart(state, action);
        case actionTypes.GET_PAYMENT_INFO_FAIL: return getPaymentInfoFail(state, action);
        case actionTypes.GET_PAYMENT_INFO_SUCCESS: return getPaymentInfoSuccess(state, action);
        
        default: return state;
    }
};

export default reducer;
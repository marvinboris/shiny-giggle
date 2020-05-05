import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    plans: null,
    links: null,
    plan: null,
    methods: null,
    message: null,
    loading: false,
    error: null
};

const getPlansStart = (state, action) => updateObject(state, { loading: true });
const getPlansSuccess = (state, action) => updateObject(state, { loading: false, error: null, ...action });
const getPlansFail = (state, action) => updateObject(state, { loading: false, ...action });

const getPaymentInfoStart = (state, action) => updateObject(state, { loading: true });
const getPaymentInfoSuccess = (state, action) => updateObject(state, { loading: false, error: null, ...action });
const getPaymentInfoFail = (state, action) => updateObject(state, { loading: false, ...action });

const postLimoPaymentStart = (state, action) => updateObject(state, { loading: true });
const postLimoPaymentSuccess = (state, action) => updateObject(state, { loading: false, error: null, ...action });
const postLimoPaymentFail = (state, action) => updateObject(state, { loading: false, ...action });

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_PLANS_START: return getPlansStart(state, action);
        case actionTypes.GET_PLANS_FAIL: return getPlansFail(state, action);
        case actionTypes.GET_PLANS_SUCCESS: return getPlansSuccess(state, action);

        case actionTypes.GET_PAYMENT_INFO_START: return getPaymentInfoStart(state, action);
        case actionTypes.GET_PAYMENT_INFO_FAIL: return getPaymentInfoFail(state, action);
        case actionTypes.GET_PAYMENT_INFO_SUCCESS: return getPaymentInfoSuccess(state, action);

        case actionTypes.POST_LIMO_PAYMENT_START: return postLimoPaymentStart(state, action);
        case actionTypes.POST_LIMO_PAYMENT_FAIL: return postLimoPaymentFail(state, action);
        case actionTypes.POST_LIMO_PAYMENT_SUCCESS: return postLimoPaymentSuccess(state, action);

        default: return state;
    }
};

export default reducer;
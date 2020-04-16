import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    token: null,
    error: null,
    loading: false,
    authRedirectPath: '/plans'
};

const authStart = (state, action) => updateObject(state, { error: null, loading: true });

const authLoginSuccess = (state, action) => updateObject(state, { error: null, loading: false, ...action});

const authSignupSuccess = (state, action) => updateObject(state, { error: null, loading: false, ...action});

const authGuestSignupSuccess = (state, action) => updateObject(state, { error: null, loading: false, ...action});

const authFail = (state, action) => updateObject(state, { loading: false, ...action });

const authLogout = (state, action) => updateObject(state, { loading: false, token: null });

const setAuthRedirectPath = (state, action) => updateObject(state, { authRedirectPath: action.path });

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_LOGIN_SUCCESS: return authLoginSuccess(state, action);
        case actionTypes.AUTH_SIGNUP_SUCCESS: return authSignupSuccess(state, action);
        case actionTypes.AUTH_GUEST_SIGNUP_SUCCESS: return authGuestSignupSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state, action);

        default: return state;
    }
};

export default reducer;
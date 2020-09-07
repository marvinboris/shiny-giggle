import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    token: null,
    error: null,
    data: {},
    hash: null,
    signup: { status: false, email: null },
    loading: false,
    message: null,
    authRedirectPath: '/plans'
};

const authStart = (state, action) => updateObject(state, { error: null, loading: true, message: null });
const authLoginSuccess = (state, action) => updateObject(state, { error: null, loading: false, ...action });
const authPhotoSuccess = (state, action) => updateObject(state, { error: null, loading: false, data: updateObject(state.data, { photo: action.photo }) });
const authSignupSuccess = (state, action) => updateObject(state, { error: null, loading: false, ...action });
const clearSignup = (state, action) => updateObject(state, { error: null, loading: false, ...action });
const authGuestSuccess = (state, action) => updateObject(state, { error: null, loading: false, ...action });
const authCodeSuccess = (state, action) => updateObject(state, { error: null, loading: false, ...action });
const authAdminSuccess = (state, action) => updateObject(state, { error: null, loading: false, ...action });
const authVerifySuccess = (state, action) => updateObject(state, { error: null, loading: false, ...action });
const resendCodeSuccess = (state, action) => updateObject(state, { error: null, loading: false, ...action });
const authLogoutSuccess = (state, action) => updateObject(state, { loading: false, token: null });
const authFail = (state, action) => updateObject(state, { loading: false, ...action });
const authMessage = (state, action) => updateObject(state, { loading: false, ...action });
const setAuthRedirectPath = (state, action) => updateObject(state, { authRedirectPath: action.path });
const setHash = (state, action) => updateObject(state, { hash: action.hash });

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_LOGIN_SUCCESS: return authLoginSuccess(state, action);
        case actionTypes.AUTH_PHOTO_SUCCESS: return authPhotoSuccess(state, action);
        case actionTypes.AUTH_SIGNUP_SUCCESS: return authSignupSuccess(state, action);
        case actionTypes.CLEAR_SIGNUP: return clearSignup(state, action);
        case actionTypes.AUTH_GUEST_SUCCESS: return authGuestSuccess(state, action);
        case actionTypes.AUTH_CODE_SUCCESS: return authCodeSuccess(state, action);
        case actionTypes.AUTH_ADMIN_SUCCESS: return authAdminSuccess(state, action);
        case actionTypes.AUTH_VERIFY_SUCCESS: return authVerifySuccess(state, action);
        case actionTypes.RESEND_CODE_SUCCESS: return resendCodeSuccess(state, action);
        case actionTypes.AUTH_LOGOUT_SUCCESS: return authLogoutSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_MESSAGE: return authMessage(state, action);
        case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state, action);
        case actionTypes.SET_HASH: return setHash(state, action);

        default: return state;
    }
};

export default reducer;
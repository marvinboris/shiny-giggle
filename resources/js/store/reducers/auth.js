import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';


const initialState = {
    token: null,
    error: null,
    loading: false,
    authRedirectPath: '/subscrib'
};

const authStart = (state, action) => updateObject(state, { error: null, loading: true });

const authSuccess = (state, action) => {
    console.log("authSucess")
    return updateObject(state, {
        token: action.access_token,
        error: null,
        loading: false
    });
};

const saveUser = (state, action) => console.log("userSaved");

const authFail = (state, action) => updateObject(state, {
    error: action.error,
    loading: false
});

const authLogout = (state, action) => {
    console.log("authLogued out");
    return updateObject(state, { token: null });
};

const setAuthRedirectPath = (state, action) => updateObject(state, { authRedirectPath: action.path });

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.SAVE_USER: return saveUser(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state, action);
        default: return state;
    }
};

export default reducer;
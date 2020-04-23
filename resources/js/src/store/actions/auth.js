import * as actionTypes from './actionTypes';
import { rootPath } from '../..';

const authStart = () => ({
    type: actionTypes.AUTH_START
});

const authLoginSuccess = (token, data) => ({
    type: actionTypes.AUTH_LOGIN_SUCCESS,
    token,
    data: { ...data, role: 'user' }
});

const authSignupSuccess = email => ({
    type: actionTypes.AUTH_SIGNUP_SUCCESS,
    signup: { status: true, email },
});

export const clearSignup = () => ({
    type: actionTypes.CLEAR_SIGNUP,
    signup: { status: false, email: null }
});

const authGuestSuccess = (token, data) => ({
    type: actionTypes.AUTH_GUEST_SUCCESS,
    token,
    data: { ...data, role: 'guest' }
});

const authCodeSuccess = (token, data) => ({
    type: actionTypes.AUTH_CODE_SUCCESS,
    token,
    data: { ...data, role: 'guest' }
});

const authFail = error => ({
    type: actionTypes.AUTH_FAIL,
    error
});

export const authLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    return {
        type: actionTypes.AUTH_LOGOUT,
        data: {}
    };
};

const checkAuthTimeout = (expirationTime) => dispatch => {
    setTimeout(() => {
        dispatch(authLogout());
    }, expirationTime);
};

export const authLogin = data => async dispatch => {
    dispatch(authStart());

    try {
        const form = new FormData(data);

        const res = await fetch(rootPath + '/api/user/login', {
            method: 'POST',
            mode: 'cors',
            body: form,
        });

        const resData = await res.json();

        let { access_token, token_type, expires_at, userData } = resData;
        const token = token_type + ' ' + access_token;
        expires_at = new Date(expires_at).getTime();

        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));
        console.log(resData)

        const expirationDate = new Date(expires_at);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(authLoginSuccess(token, userData));
        dispatch(checkAuthTimeout(expires_at - new Date().getTime()));
    } catch (err) {
        dispatch(authFail(err));
    }
};

export const authSignup = data => async dispatch => {
    dispatch(authStart());

    try {
        const form = new FormData(data);

        const res = await fetch(rootPath + '/api/user/signup', {
            method: 'POST',
            mode: 'cors',
            body: form,
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));
        if (res.status !== 200 && res.status !== 201) {
            throw new Error('Authentication has failed.');
        }

        dispatch(authSignupSuccess(resData.email));
    } catch (err) {
        dispatch(authFail(err));
    }
};

export const authCode = data => async dispatch => {
    dispatch(authStart());

    try {
        const form = new FormData(data);

        const res = await fetch(rootPath + '/api/guest/login', {
            method: 'POST',
            mode: 'cors',
            body: form,
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        let { access_token, token_type, expires_at, userData } = resData;
        const token = token_type + ' ' + access_token;
        expires_at = new Date(expires_at).getTime();

        const expirationDate = new Date(expires_at);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(authCodeSuccess(token, userData));
        dispatch(checkAuthTimeout(expires_at - new Date().getTime()));
    } catch (err) {
        dispatch(authFail(err));
    }
};

export const authGuest = data => async dispatch => {
    dispatch(authStart());

    try {
        const form = new FormData(data);

        const res = await fetch(rootPath + '/api/guest/signup', {
            method: 'POST',
            mode: 'cors',
            body: form,
        });

        const resData = await res.json();
        if (res.status === 422) throw new Error(Object.values(resData.errors).join('\n'));

        let { access_token, token_type, expires_at, userData } = resData;
        const token = token_type + ' ' + access_token;
        expires_at = new Date(expires_at).getTime();

        const expirationDate = new Date(expires_at);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(authGuestSuccess(token, userData));
        dispatch(checkAuthTimeout(expires_at - new Date().getTime()));
    } catch (err) {
        dispatch(authFail(err));
    }
};

export const setAuthRedirectPath = path => ({
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path
});

export const authCheckState = () => async dispatch => {
    dispatch(authStart());
    const token = localStorage.getItem('token');
    if (!token) dispatch(authLogout());
    else {
        try {
            const res = await fetch(rootPath + '/api/user', {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            });

            if (res.status === 521) dispatch(authLogout());
            else if (res.status !== 200 && res.status !== 201) {
                throw new Error('Erreur lors de la récupération des informations.');
            }

            const { data, role } = await res.json();

            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate > new Date()) {
                if (role === 'user') dispatch(authLoginSuccess(token, data));
                else if (role === 'guest') dispatch(authCodeSuccess(token, data));
                dispatch(checkAuthTimeout(expirationDate.getTime() - new Date().getTime()));
            } else dispatch(authLogout());
        } catch (err) {
            dispatch(authFail(err));
        }
    }
};
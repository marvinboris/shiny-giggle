import * as actionTypes from './actionTypes';

const authStart = () => ({
    type: actionTypes.AUTH_START
});

const authLoginSuccess = token => ({
    type: actionTypes.AUTH_LOGIN_SUCCESS,
    token,
});

const authSignupSuccess = () => ({
    type: actionTypes.AUTH_SIGNUP_SUCCESS,
    signup_success: true,
});

const authGuestSignupSuccess = token => ({
    type: actionTypes.AUTH_GUEST_SIGNUP_SUCCESS,
    token,
});

const authFail = error => ({
    type: actionTypes.AUTH_FAIL,
    error
});

export const authLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    return {
        type: actionTypes.AUTH_LOGOUT
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

        const res = await fetch('/invest-laravel/api/user/login', {
            method: 'POST',
            mode: 'cors',
            body: form,
        });

        const resData = await res.json();

        let { access_token, token_type, expires_at } = resData;
        const idToken = token_type + ' ' + access_token;
        expires_at = new Date(expires_at).getTime();

        const expirationDate = new Date(expires_at);
        localStorage.setItem('token', idToken);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(authLoginSuccess(idToken));
        dispatch(checkAuthTimeout(expires_at - new Date().getTime()));
    } catch (err) {
        dispatch(authFail(err));
    }
};

export const authSignup = data => async dispatch => {
    dispatch(authStart());

    try {
        const form = new FormData(data);

        const res = await fetch('/invest-laravel/api/user/signup', {
            method: 'POST',
            mode: 'cors',
            body: form,
        });

        if (res.status === 422) throw new Error('La validation a échoué. Assurez-vous que cette adresse mail n\'est pas utilisée.');
        if (res.status !== 200 && res.status !== 201) {
            throw new Error('L\'authentification a échoué.');
        }

        dispatch(authSignupSuccess());
    } catch (err) {
        dispatch(authFail(err));
    }
};

export const authGuestSignup = data => async dispatch => {
    dispatch(authStart());

    try {
        const form = new FormData(data);

        const res = await fetch('/invest-laravel/api/guest/login', {
            method: 'POST',
            mode: 'cors',
            body: form,
        });

        const resData = await res.json();

        let { access_token, token_type, expires_at } = resData;
        const idToken = token_type + ' ' + access_token;
        expires_at = new Date(expires_at).getTime();

        const expirationDate = new Date(expires_at);
        localStorage.setItem('token', idToken);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(authGuestSignupSuccess(idToken));
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
            const res = await fetch('/invest-laravel/api/guest/user', {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            });

            if (res.status === 521) dispatch(authLogout());
            else if (res.status !== 200 && res.status !== 201) {
                throw new Error('Erreur lors de la récupération des informations.');
            }

            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate > new Date()) {
                dispatch(authLoginSuccess(token));
                dispatch(checkAuthTimeout(expirationDate.getTime() - new Date().getTime()));
            } else dispatch(authLogout());
        } catch (err) {
            dispatch(authFail(err));
        }
    }
};
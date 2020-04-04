import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, isSignup) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        access_token: token,
    };
};


export const authFail = (error) => {
    console.log("[authFail]" + error);
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logOut());
        }, expirationTime * 1000);
    };
};


export const auth = (authData, isSignup) => dispatch => {
    dispatch(authStart());

    if (!isSignup) {
        console.log("Login")

    }
    else if (isSignup) {

        console.log("Guest Signup");
        console.log(authData)
        const form = new FormData(authData);
        fetch('http://127.0.0.1:8000/api/guest/login', {
            method: 'POST',
            mode: 'cors',
            body: form,
        })
            .then(res => res.json())
            .then(resData => {
                let { access_token, token_type, expires_at } = resData;
                const idToken = token_type + ' ' + access_token;
                expires_at = new Date(expires_at).getTime();

                const expirationDate = new Date(expires_at);
                localStorage.setItem('token', idToken);
                localStorage.setItem('expirationDate', expirationDate);
                dispatch(authSuccess(idToken, true));
                dispatch(checkAuthTimeout(expires_at / 1000));
            })
            .catch(err => console.log(err));
    }


};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const authCheckState = () => {
    console.log("authCheck")
    return dispatch => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            dispatch(logOut());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logOut());
            } else {
                dispatch(authSuccess(token, true));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
            }
        }
    };
};
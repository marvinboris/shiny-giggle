import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState2 = {
    paymentlink:'none',
    price:0,
};

 const setPayementPage = (state,action) => updateObject(state,{page:action.Page});

 const setPaymentLink = (state,action) => updateObject(state,{paymentlink:action.paymentLink,price:action.price});



const reducer = (state = initialState2, action) => {
    switch (action.type) {
        case actionTypes.GET_PAYEMENT_PAGE: return setPayementPage(state, action);
        case actionTypes.SET_PAYEMENT_LINK: return setPaymentLink(state, action);
        default: return state;
    }
};

export default reducer;
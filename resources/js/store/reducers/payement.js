import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    page:null
};

export const setPayementPage = (state,action) => updateObject(state,{Page:action.Page});


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_PAYEMENT_PAGE: return setPayementPage(state, action);
       
        default: return state;
    }
};

export default reducer;
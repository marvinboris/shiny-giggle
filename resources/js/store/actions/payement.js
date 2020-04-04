import * as actionTypes from './actionTypes';

export const setPayementPage = (page)=> {
   
    return {
        type:actionTypes.GET_PAYEMENT_PAGE,
        links:page

    }
}

export const getPayementPage =() => dispatch=> {

    
    fetch('https://www.monetbil.africa/pay/v2.1/gKznLEpbkBj7EOXVxx3WvH4Yw3Ijuk').then(response=>{
        response.text();
    }).then(html=>{
        console.log(html);

    })
        .catch(err => console.log(err));
}
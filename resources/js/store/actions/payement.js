import * as actionTypes from './actionTypes';

export const setPayementPage = (page)=> {
   
    return {
        type:actionTypes.GET_PAYEMENT_PAGE,
        link:page

    }
}

export const getPayementPage =() => dispatch=> {

    
    fetch('http://127.0.0.1:8000/api/plans/silver-plan/payment').then(response=>{
        response.text();
    }).then(html=>{
        console.log(html);

    })
        .catch(err => console.log(err));
}
export const setPaymentLink = (link,price)  =>{
    console.log("setPayement link is seted ")
    return {
        type:actionTypes.SET_PAYEMENT_LINK,
        paymentLink:link,
        price:price
    }
 
}
export const getPaymentLink = (link,method) => dispatch=> {
    
    let PaymentLink='';
    let price=0;
    fetch(link, {
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZjg2MGNkN2NhMjcyMzU1NWU2YTMxNWE4MzY2ZDQ5YTJkODIwMjZkODc3ZDJmNDViMTIzZDY5ZDNhNTBkY2NlOGFkNWE4ZDY1M2IzNThjZjMiLCJpYXQiOjE1ODU5MjgwMzUsIm5iZiI6MTU4NTkyODAzNSwiZXhwIjoxNjE3NDY0MDM1LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.CARqh3MGfv2jePL5VLryjEa4sHwsDlIbeFjIZtCVjSCLKAmXeWLwyh3s-3C67zFHnzC8u-1bDG1PppA7knjy6fCQXjbPpWg3N0GnQeDmfxZqULyVjkiO6gRkWS0BwxpftkStz63POC44492sJ0To3pUpEGCki8ObKQ409cTzSJJX0DRXCmw5vxv_iofjdJpIGtzRZleEUwMxTL8kx18QEYQn4_2nLPbzvQ4T8kTXOkoy21rAMPzKS_l1Sx1JpNt5xxGt-gS2u_rhKKm7IBw33xojrJ-mqbjvQcv4UEzuHphb6Go67M5HqMIyrf3CrmCQQhtD7eQiQnwcCnfLYxzbk6yQkhRC8AstqLAnx7d2aLLgMayOBK27cjcgo36LjMFDT1GpjhUg7MHlnBh5FICH8uO3QBS-RI3z28c-_wPJlMCak2H0W0G1-pJS1rXqY7kl0gdjyhw559zAlc0AZ58TsSiJ_322043dU-JkLkm9_7LJ5xZ4_mpMNElevd78eGgY2fMAm_WbWFMu5NAcL1qKYmbT7SSOjHM9wPkdgoE7rBP5l2GRC0_PpULOn5aflLSj6tE_1mFDytac_nQAZGapcIsoImUFrxA9rnZrBteT3Xj1ye7eaNRaPMdSgyyN5ns1YGCFFhDaMVVeOno3XUpz6BrmEMQZFrVc6ApG3ka8A-E'
        }
        
        
    }).then(res =>res.json()).then(data=>(data)).then(response=>{
        console.log(response.methods[1].link);
        PaymentLink = response.methods[1].link;
        price = response.plan.price;
        console.log(price)
        console.log("SETPAY")
        dispatch(setPaymentLink(PaymentLink,price));
    })
    .catch(err=>console.log(err))
}

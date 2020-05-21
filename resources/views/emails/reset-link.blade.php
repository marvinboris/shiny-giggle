<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet"> 
<div
    style="box-sizing: border-box; text-align: center; background-color: white; padding: 65px 1rem; width: 100%; font-size: 1.125rem; font-family: Poppins, Montserrat, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
    <div style="margin: auto; width: 840px; max-width: 100%; background-color: #F4F8FB; padding: 35px 40px;">
        <div style="padding: 36px 31px; background-color: white;">
            <img src="{{ asset('images/email/logo.png') }}" width="270" alt="Logo">

            <div style="margin: 72px 0 50px 0; font-weight: 700; color: #06B0B6; font-size: 30px;">Reset password</div>

            <p style="font-weight: 300;">
                Click on this link to reset your account password.
            </p>

            <a href="{{ $link }}"
                style="display: inline-block; margin: 37px 0 43px 0; border: none; border-radius: 3px; background: #F5A10E; padding: 1.5rem 2.5rem; text-decoration: none; color: white;">
                Reset password
            </a>
        </div>

        <div style="display: flex; margin: 3rem 0 2.625rem 0; justify-content: space-around; color: #06B0B6; font-weight: 700;">
            <div>HELP CENTER</div>
            <div>SUPPORT 24/7</div>
            <div>ACCOUNT</div>
        </div>
        
        <div style="font-size: 15px;">
            <div>Copyright 2020 Liyeplimal Reinvestment System Calculator. All rights reserved by <span style="font-weight: 700; color: #06B0B6;">Briluce Services</span>.</div>
            <div style="font-weight: 700; margin: 10px 0 53px 0;">support@limocalc.com    |   +237 612 123 123    |   Unsubscribe</div>        
        </div>
        
        <div style="width: 224px; color: #06B0B6; display: flex; margin: auto;">
            <img src="{{ asset('/images/fa/facebook-square@2x.png') }}" height="26" alt="Facebook">
            <img src="{{ asset('/images/fa/twitter-square@2x.png') }}" height="26" alt="Twitter">
            <img src="{{ asset('/images/fa/instagram@2x.png') }}" height="26" alt="Instagram">
            <img src="{{ asset('/images/fa/whatsapp@2x.png') }}" height="26" alt="Whatsapp">
        </div>
    </div>
</div>
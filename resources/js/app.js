/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

window.BTC_VALUE_API_KEY = process.env.MIX_BTC_VALUE_API_KEY;

window.CORS = "https://jsonp.afeld.me/?url=";

import Echo from 'laravel-echo';

window.$ = window.jQuery = require('jquery');

window.Pusher = require('pusher-js');

// Pusher.logToConsole = true;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: '8999d815348d7891d58d',
    cluster: 'mt1',
    forceTLS: true,
});

require('./src/index');

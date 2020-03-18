<?php

/**
 *  ... Please MODIFY this file ...
 *
 *
 *  YOUR MYSQL DATABASE DETAILS
 *
 */

define("DB_HOST",     env('DB_HOST'));                // hostname
define("DB_USER",     env('DB_USERNAME'));        // database username
define("DB_PASSWORD",     env('DB_PASSWORD'));        // database password
define("DB_NAME",     env('DB_DATABASE'));    // database name




/**
 *  ARRAY OF ALL YOUR CRYPTOBOX PRIVATE KEYS
 *  Place values from your gourl.io signup page
 *  array("your_privatekey_for_box1", "your_privatekey_for_box2 (otional)", "etc...");
 */

$cryptobox_private_keys = array(env('CRYPTOBOX_PRIVATE_KEY'));
//  $cryptobox_private_keys = array(
//     "25654AAo79c3Bitcoin77BTCPRV0JG7w3jg0Tc5Pfi34U8o5JE", "25678AACxnGODogecoin77DOGEPRVFvl6IDdisuWHVJLo5m4eq",
//     "25656AAeOGaPBitcoincash77BCHPRV8quZcxPwfEc93ArGB6D", "25657AAOwwzoLitecoin77LTCPRV7hmp8s3ew6pwgOMgxMq81F",
//     "25678AACxnGODogecoin77DOGEPRVFvl6IDdisuWHVJLo5m4eq", "25658AAo79c3Dash77DASHPRVG7w3jg0Tc5Pfi34U8o5JEiTss",
//     "20116AA36hi8Speedcoin77SPDPRVNOwjzYNqVn4Sn5XOwMI2c"
// );



define("CRYPTOBOX_PRIVATE_KEYS", implode("^", $cryptobox_private_keys));
unset($cryptobox_private_keys);

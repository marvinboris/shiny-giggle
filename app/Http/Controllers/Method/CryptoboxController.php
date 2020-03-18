<?php

namespace App\Http\Controllers\Method;

use App\Http\Controllers\Controller;
use App\Plan;
use Cryptobox;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CryptoboxController extends Controller
{
    //
    public function index(Request $request)
    {
        $user = $request->user();
        $plan = Plan::findOrFail($request->plan_id);

        // Open Source Bitcoin Payment Library
        // ---------------------------------------------------------------
        require_once("cryptobox.class.php");

        /*********************************************************/
        /****  PAYMENT BOX CONFIGURATION VARIABLES  ****/
        /*********************************************************/

        // IMPORTANT: Please read description of options here - https://gourl.io/api-php.html#options

        $userID                 = $user->ref;             // place your registered userID or md5(userID) here (user1, user7, uo43DC, etc).
        // You can use php $_SESSION["userABC"] for store userID, amount, etc
        // You don't need to use userID for unregistered website visitors - $userID = "";
        // if userID is empty, system will autogenerate userID and save it in cookies
        $userFormat        = "COOKIE";        // save userID in cookies (or you can use IPADDRESS, SESSION, MANUAL)
        $orderID            = $plan->id;            // invoice number - 000383
        $amountUSD        = $plan->amount;            // invoice amount - 2.21 USD; or you can use - $amountUSD = convert_currency_live("EUR", "USD", 22.37); // convert 22.37EUR to USD

        $period            = "NOEXPIRY";    // one time payment, not expiry
        $def_language    = "en";            // default Language in payment box
        $def_coin            = "bitcoin";        // default Coin in payment box


        // List of coins that you accept for payments
        //$coins = array('bitcoin', 'bitcoincash', 'bitcoinsv', 'litecoin', 'dogecoin', 'dash', 'speedcoin', 'reddcoin', 'potcoin', 'feathercoin', 'vertcoin', 'peercoin', 'monetaryunit', 'universalcurrency');
        // $coins = array('bitcoin', 'litecoin', 'dogecoin', 'dash', 'speedcoin');  // for example, accept payments in bitcoin, bitcoincash, litecoin, dash, speedcoin 
        $coins = array('bitcoin');  // for example, accept payments in bitcoin, bitcoincash, litecoin, dash, speedcoin 

        // Create record for each your coin - https://gourl.io/editrecord/coin_boxes/0 ; and get free gourl keys
        // It is not bitcoin wallet private keys! Place GoUrl Public/Private keys below for all coins which you accept

        $all_keys = array(
            "bitcoin"  =>         array("public_key" => env('CRYPTOBOX_PUBLIC_KEY'),  "private_key" => env('CRYPTOBOX_PRIVATE_KEY')),
        ); // etc.

        // Demo Keys; for tests	(example - 5 coins)
        // $all_keys = array(
        //     "bitcoin" => array(
        //         "public_key" => "25654AAo79c3Bitcoin77BTCPUBqwIefT1j9fqqMwUtMI0huVL",
        //         "private_key" => "25654AAo79c3Bitcoin77BTCPRV0JG7w3jg0Tc5Pfi34U8o5JE"
        //     ),
        //     "bitcoincash" => array(
        //         "public_key" => "25656AAeOGaPBitcoincash77BCHPUBOGF20MLcgvHMoXHmMRx",
        //         "private_key" => "25656AAeOGaPBitcoincash77BCHPRV8quZcxPwfEc93ArGB6D"
        //     ),
        //     "litecoin" => array(
        //         "public_key" => "25657AAOwwzoLitecoin77LTCPUB4PVkUmYCa2dR770wNNstdk",
        //         "private_key" => "25657AAOwwzoLitecoin77LTCPRV7hmp8s3ew6pwgOMgxMq81F"
        //     ),
        //     "dogecoin" => array(
        //         "public_key" => "25678AACxnGODogecoin77DOGEPUBZEaJlR9W48LUYagmT9LU8",
        //         "private_key" => "25678AACxnGODogecoin77DOGEPRVFvl6IDdisuWHVJLo5m4eq"
        //     ),
        //     "dash" => array(
        //         "public_key" => "25658AAo79c3Dash77DASHPUBqwIefT1j9fqqMwUtMI0huVL0J",
        //         "private_key" => "25658AAo79c3Dash77DASHPRVG7w3jg0Tc5Pfi34U8o5JEiTss"
        //     ),
        //     "speedcoin" => array(
        //         "public_key" => "20116AA36hi8Speedcoin77SPDPUBjTMX31yIra1IBRssY7yFy",
        //         "private_key" => "20116AA36hi8Speedcoin77SPDPRVNOwjzYNqVn4Sn5XOwMI2c"
        //     )
        // ); 
        // Demo keys!

        // Re-test - all gourl public/private keys
        $def_coin = strtolower($def_coin);
        if (!in_array($def_coin, $coins)) $coins[] = $def_coin;
        foreach ($coins as $v) {
            if (!isset($all_keys[$v]["public_key"]) || !isset($all_keys[$v]["private_key"])) die("Please add your public/private keys for '$v' in \$all_keys variable");
            elseif (!strpos($all_keys[$v]["public_key"], "PUB"))  die("Invalid public key for '$v' in \$all_keys variable");
            elseif (!strpos($all_keys[$v]["private_key"], "PRV")) die("Invalid private key for '$v' in \$all_keys variable");
            elseif (strpos(CRYPTOBOX_PRIVATE_KEYS, $all_keys[$v]["private_key"]) === false)
                die("Please add your private key for '$v' in variable \$cryptobox_private_keys, file /lib/cryptobox.config.php.");
        }


        // Current selected coin by user
        $coinName = cryptobox_selcoin($coins, $def_coin);


        // Current Coin public/private keys
        $public_key  = $all_keys[$coinName]["public_key"];
        $private_key = $all_keys[$coinName]["private_key"];



        /** PAYMENT BOX **/
        $options = array(
            "public_key"      => $public_key,    // your public key from gourl.io
            "private_key"     => $private_key,    // your private key from gourl.io
            "webdev_key"      => "",             // optional, gourl affiliate key
            "orderID"         => $orderID,         // order id or product name
            "userID"              => $userID,         // unique identifier for every user
            "userFormat"      => $userFormat,     // save userID in COOKIE, IPADDRESS, SESSION  or MANUAL
            "amount"             => 0,            // product price in btc/bch/bsv/ltc/doge/etc OR setup price in USD below
            "amountUSD"       => $amountUSD,    // we use product price in USD
            "period"              => $period,         // payment valid period
            "language"          => $def_language  // text on EN - english, FR - french, etc
        );

        // Initialise Payment Class
        $box = new Cryptobox($options);

        // coin name
        $coinName = $box->coin_name();

        // php code end :)
        // ---------------------

        // NOW PLACE IN FILE "lib/cryptobox.newpayment.php", function cryptobox_new_payment(..) YOUR ACTIONS -
        // WHEN PAYMENT RECEIVED (update database, send confirmation email, update user membership, etc)
        // IPN function cryptobox_new_payment(..) will automatically appear for each new payment two times - payment received and payment confirmed
        // Read more - https://gourl.io/api-php.html#ipn

        return view('pages.user.finance.deposit.cryptobox.index', [
            'box' => $box,
            'coins' => $coins,
            'def_coin' => $def_coin,
            'def_language' => $def_language,
        ]);
    }

    public function callback(Request $request)
    {
        if (!defined("CRYPTOBOX_WORDPRESS")) define("CRYPTOBOX_WORDPRESS", false);

        if (!CRYPTOBOX_WORDPRESS) require_once("cryptobox.class.php");
        elseif (!defined('ABSPATH')) exit; // Exit if accessed directly in wordpress


        // a. check if private key valid
        $valid_key = false;
        if (isset($request->private_key_hash) && strlen($request->private_key_hash) == 128 && preg_replace('/[^A-Za-z0-9]/', '', $request->private_key_hash) == $request->private_key_hash) {
            $keyshash = array();
            $arr = explode("^", CRYPTOBOX_PRIVATE_KEYS);
            foreach ($arr as $v) $keyshash[] = strtolower(hash("sha512", $v));
            if (in_array(strtolower($request->private_key_hash), $keyshash)) $valid_key = true;
        }


        // b. alternative - ajax script send gourl.io json data
        if (!$valid_key && isset($request->json) && $request->json == "1") {
            $data_hash = $boxID = "";
            if (isset($request->data_hash) && strlen($request->data_hash) == 128 && preg_replace('/[^A-Za-z0-9]/', '', $request->data_hash) == $request->data_hash) {
                $data_hash = strtolower($request->data_hash);
                unset($request->data_hash);
            }
            if (isset($request->box) && is_numeric($request->box) && $request->box > 0) $boxID = intval($request->box);

            if ($data_hash && $boxID) {
                $private_key = "";
                $arr = explode("^", CRYPTOBOX_PRIVATE_KEYS);
                foreach ($arr as $v) if (strpos($v, $boxID . "AA") === 0) $private_key = $v;

                if ($private_key) {
                    $data_hash2 = strtolower(hash("sha512", $private_key . json_encode($request->all()) . $private_key));
                    if ($data_hash == $data_hash2) $valid_key = true;
                }
                unset($private_key);
            }

            if (!$valid_key) die("Error! Invalid Json Data sha512 Hash!");
        }


        // c.
        if ($request->all()) foreach ($request->all() as $k => $v) if (is_string($v)) $request->k = trim($v);



        // d.
        if (isset($request->plugin_ver) && !isset($request->status) && $valid_key) {
            echo "cryptoboxver_" . (CRYPTOBOX_WORDPRESS ? "wordpress_" . GOURL_VERSION : "php_" . CRYPTOBOX_VERSION);
            die;
        }


        // e.
        if (
            isset($request->status) && in_array($request->status, array("payment_received", "payment_received_unrecognised")) &&
            $request->box && is_numeric($request->box) && $request->box > 0 && $request->amount && is_numeric($request->amount) && $request->amount > 0 && $valid_key
        ) {

            foreach ($request->all() as $k => $v) {
                if ($k == "datetime")                         $mask = '/[^0-9\ \-\:]/';
                elseif (in_array($k, array("err", "date", "period")))        $mask = '/[^A-Za-z0-9\.\_\-\@\ ]/';
                else                                $mask = '/[^A-Za-z0-9\.\_\-\@]/';
                if ($v && preg_replace($mask, '', $v) != $v)     $request->k = "";
            }

            if (!$request->amountusd || !is_numeric($request->amountusd))    $request->amountusd = 0;
            if (!$request->confirmed || !is_numeric($request->confirmed))    $request->confirmed = 0;


            $dt            = gmdate('Y-m-d H:i:s');
            $obj         = run_sql("select paymentID, txConfirmed from crypto_payments where boxID = " . intval($request->box) . " && orderID = '" . addslashes($request->order) . "' && userID = '" . addslashes($request->user) . "' && txID = '" . addslashes($request->tx) . "' && amount = " . floatval($request->amount) . " && addr = '" . addslashes($request->addr) . "' limit 1");


            $paymentID        = ($obj) ? $obj->paymentID : 0;
            $txConfirmed    = ($obj) ? $obj->txConfirmed : 0;

            // Save new payment details in local database
            if (!$paymentID) {
                $sql = "INSERT INTO crypto_payments (boxID, boxType, orderID, userID, countryID, coinLabel, amount, amountUSD, unrecognised, addr, txID, txDate, txConfirmed, txCheckDate, recordCreated)
				VALUES (" . intval($request->box) . ", '" . addslashes($request->boxtype) . "', '" . addslashes($request->order) . "', '" . addslashes($request->user) . "', '" . addslashes($request->usercountry) . "', '" . addslashes($request->coinlabel) . "', " . floatval($request->amount) . ", " . floatval($request->amountusd) . ", " . ($request->status == "payment_received_unrecognised" ? 1 : 0) . ", '" . addslashes($request->addr) . "', '" . addslashes($request->tx) . "', '" . addslashes($request->datetime) . "', " . intval($request->confirmed) . ", '$dt', '$dt')";

                $paymentID = run_sql($sql);

                $box_status = "cryptobox_newrecord";
            }
            // Update transaction status to confirmed
            elseif ($request->confirmed && !$txConfirmed) {
                $sql = "UPDATE crypto_payments SET txConfirmed = 1, txCheckDate = '$dt' WHERE paymentID = " . intval($paymentID) . " LIMIT 1";
                run_sql($sql);

                $box_status = "cryptobox_updated";
            } else {
                $box_status = "cryptobox_nochanges";
            }


            /**
             *  User-defined function for new payment - cryptobox_new_payment(...)
             *  For example, send confirmation email, update database, update user membership, etc.
             *  You need to modify file - cryptobox.newpayment.php
             *  Read more - https://gourl.io/api-php.html#ipn
             */

            if (in_array($box_status, array("cryptobox_newrecord", "cryptobox_updated")) && function_exists('cryptobox_new_payment')) cryptobox_new_payment($paymentID, $request->all(), $box_status);
        } else
            $box_status = "Only POST Data Allowed";


        echo $box_status; // don't delete it    

    }
}

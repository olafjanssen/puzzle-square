<?php
/**
 * Created by PhpStorm.
 * User: olafjanssen
 * Date: 3/12/14
 * Time: 10:38 PM
 */

function return_error($message) {
    $response = ['status' => 'failure', $reason => $message];
    print json_encode($response);
    die();
}

header('Content-Type: application/json');

$request = $_POST;

$action = $request['action'];
$userId = $request['userId'];

if ($action == "commit-events") {
    $data = $request['data'];

    // Create connection
    $con = @mysqli_connect("127.0.0.1","build","build","square") or return_error("cannot connect to DB");

    foreach ($data as $value) {
        $uid = $userId;
        $clientId = $value['clientId'];
        $event = $value['event'];
        $payload = json_encode($value['payload']);
        $timestamp = round(microtime(true) * 1000);
        $ip = $_SERVER['REMOTE_ADDR'];
        mysqli_query($con,"INSERT INTO events (userId, clientId, message, payload, timestamp, ip) VALUES ('$uid', '$clientId', '$event', '$payload', $timestamp, '$ip')") or return_error("cannot insert record");
    }



    $response = ['status' => 'ok', 'data' => $data];
} else {
    $response = ['status' => 'failure', $reason => 'unknown action'];
}

print json_encode($response);

?>
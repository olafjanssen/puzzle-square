<?php
/**
 * User: olafjanssen
 * Date: 3/12/14
 * Time: 10:38 PM
 */

function return_error($message) {
    $response = ['status' => 'failure', $reason => $message];
    print json_encode($response);
    die();
}

function isGUID($value){
 return preg_match("/^(\{)?[a-f\d]{8}(-[a-f\d]{4}){4}[a-f\d]{8}(?(1)\})$/i", $value);
}

header('Content-Type: application/json');

$request = $_POST;

$action = $request['action'];
$userId = $request['userId'];

// validation
if (!isGUID($userId)){
    return_error("invalid userId");
}

if ($action == "commit-events") {
    $data = $request['data'];

    // Create connection
    $con = @mysqli_connect("127.0.0.1","build","build","square") or return_error("cannot connect to DB");

    $clientIds = [];
    foreach ($data as $value) {
        $clientId = $value['clientId'];
        $event = $value['event'];
        $payload = json_encode($value['payload']);
        $timestamp = round(microtime(true) * 1000);
        $ip = $_SERVER['REMOTE_ADDR'];

        $clientIds[] = "'". $clientId . "'";

        // validation
        if (!isGUID($clientId)){
            return_error("invalid clientId");
        }

        mysqli_query($con,"INSERT INTO events (userId, clientId, event, payload, timestamp, ip) VALUES ('$userId', '$clientId', '$event', '$payload', $timestamp, '$ip') ON DUPLICATE KEY UPDATE timestamp=$timestamp") or return_error("cannot insert record");
    }

    // produce response
    $response_data = [];
    $result = mysqli_query($con,"SELECT * FROM events WHERE clientId IN (" . implode(',', $clientIds) . ")");

    while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
            $row['payload'] = json_decode($row['payload']);
            $response_data[] = $row;
    }

    $response = ['status' => 'ok', 'data' => $response_data];
} else if ($action == "fetch-events") {
    $lastId = $request['lastId'];

    // Validation
    if (!is_numeric($lastId)){
        return_error("invalid lastId");
    }

    // Create connection
    $con = @mysqli_connect("127.0.0.1","build","build","square") or return_error("cannot connect to DB");

    // produce response
    $response_data = [];
    $result = mysqli_query($con,"SELECT * FROM events WHERE userId = '$userId' AND id > $lastId");

    while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
            $row['payload'] = json_decode($row['payload']);
            $response_data[] = $row;
    }

    $response = ['status' => 'ok', 'data' => $response_data];
} else {
    $response = ['status' => 'failure', $reason => 'unknown action'];
}

print json_encode($response);

?>
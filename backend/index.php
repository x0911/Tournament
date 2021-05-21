<?php
date_default_timezone_set('Africa/Cairo');
$dbToUse = "local";
$dbs = array(
  "local" => array("origin" => "http://localhost:3000", "host" => "localhost", "dbname" => "tournament", "username" => "root", "password" => ""),
  "hostednetwork" => array("origin" => "http://192.168.137.1:3000", "host" => "192.168.137.1", "dbname" => "tournament", "username" => "root", "password" => ""),
  "remote" => array("origin" => "https://trnmnts.web.app", "host" => "localhost", "dbname" => "id15217119_tournament", "username" => "id15217119_trnmnts", "password" => "M0therF0cker!"),
);

header("Access-Control-Allow-Origin: {$dbs[$dbToUse]['origin']}");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// Set default values
$theBadRequest = array("error" => "Bad request, your are not allowed to access this api.");
$returner = $theBadRequest;
$status_code = 200;
$errors = array();
$arraySeparator = "||-_-||-_-||";

// $x is the api path coming from client side
require "functions/index.php";
$x = isset($_POST["x"]) ? filterString($_POST["x"]) : null;

if ($x) {
  require "rb-mysql.php";
  R::setup(
    "mysql: host={$dbs[$dbToUse]['host']}; dbname={$dbs[$dbToUse]['dbname']};",
    "{$dbs[$dbToUse]['username']}",
    "{$dbs[$dbToUse]['password']}"
  );
  $xs = explode("/", $x); // x splitted
  $xString = count($xs) > 1 ? implode("/", array_slice($xs, 0, count($xs) - 1)) : $xs[0];
  $fileToRequire = "api/{$xString}.php";
  if (file_exists($fileToRequire)) {
    require_once $fileToRequire;
  } else {
    $status_code = 404;
  }
}

$countErrors = count(array_values($errors));
if ($countErrors > 0) {
  $errors["errors_count"] = $countErrors;
  $returner = $errors;
}

if ($returner === false || ($returner === $theBadRequest && $countErrors == 0)) {
  $status_code = 400;
}

http_response_code($status_code);
echo json_encode($returner);

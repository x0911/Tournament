<?php

function filterString($str = "")
{
  return isset($str) ? filter_var($str, FILTER_SANITIZE_STRING) : "";
};

function filterInt($str = "")
{
  return isset($str) ? filter_var($str, FILTER_SANITIZE_NUMBER_INT) : 0;
};

function getIP($ip = "")
{
  if (!$ip && strlen($ip) == 0) {
    return array();
  }
  $url = "http://ip-api.com/json/{$ip}?fields=status,message,continent,country,countryCode,regionName,city,district,lat,lon,isp";
  $data = file_get_contents($url);
  $data = json_decode($data);
  return $data;
}

function addSession($userid = "", $codeToken = "")
{
  global $errors;
  $user = R::load("user", $userid);
  if (!$user || !$user["id"]) {
    $errors["global"] = "User account has been deleted.";
    return false;
  }
  $session = R::dispense("session");
  $session["codeToken"] = $codeToken;
  $session["time"] = new DateTime();
  $session["deleted"] = false;
  $session["confirmed"] = false;
  // User Location and Device specification
  $props = [
    "isBot",
    "device",
    "brand",
    "model",
    "browser",
    "os",
    "platform",
    "ip",
  ];
  $ipProps = [
    "isp",
    "district",
    "regionName",
    "city",
    "country",
    "countryCode",
    "continent",
    "lat",
    "lon",
  ];
  foreach ($_POST as $key => $val) {
    if (in_array($key, $props)) {
      $session[$key] = trim(filterString($val));
    }
  }
  if ($session["ip"] && strlen($session["ip"]) > 0) {
    $ipData = getIP($session["ip"]);
    foreach ($ipData as $key => $val) {
      if (in_array($key, $ipProps)) {
        $session[$key] = trim(filterString($val));
      }
    }
  }
  $user->xownSessionList[] = $session;
  R::store($user);
  return true;
}

function login($userid = "")
{
  global $errors;
  $user = R::load("user", $userid);
  if (!$user || !$user["id"]) {
    $errors["global"] = "User account has been deleted.";
    return false;
  }
  $session = R::dispense("session");
  $session["token"] = rand(1111111111, 9999999999);
  $session["time"] = new DateTime();
  $session["deleted"] = false;

  // User Location and Device specification
  $props = [
    "isBot",
    "device",
    "brand",
    "model",
    "browser",
    "os",
    "platform",
    "ip",
  ];
  foreach ($_POST as $key => $val) {
    if (in_array($key, $props)) {
      $session[$key] = trim(filterString($val));
    }
  }

  $ipProps = [
    "isp",
    "district",
    "regionName",
    "city",
    "country",
    "countryCode",
    "continent",
    "lat",
    "lon",
  ];

  if ($session["ip"] && strlen($session["ip"]) > 0) {
    $ipData = getIP($session["ip"]);
    foreach ($ipData as $key => $val) {
      if (in_array($key, $ipProps)) {
        $session[$key] = trim(filterString($val));
      }
    }
  }

  $user->xownSessionList[] = $session;
  R::store($user);
  // Add cookies here
  return $session["token"];
};

function loginWithCookie()
{
  global $errors;
  $userid = isset($_POST["sessionid"]) ? $_POST["sessionid"] : null;
  $token = isset($_POST["session"]) ? $_POST["session"] : null;
  if (!$userid || !$token) {
    $errors["global"] = "There is no cookies.";
    return false;
  }
  $user = R::load("user", $userid);
  if (!$user || !$user["id"]) {
    $errors["global"] = "User account has been deleted.";
    return false;
  }
  $sessions = R::find("session", " token = ? and user_id = ? and deleted = ? ", [$token, $userid, false]);
  $counter = count(array_values($sessions));
  if ($counter == 0) {
    // There is no sessions
    $errors["global"] = "There is no active sessions for this user.";
    return false;
  }
  $x = array();
  $props = ["name", "username", "id", "picture_url"];
  foreach ($props as $prop) {
    $x[$prop] = $user[$prop];
  }
  return $x;
};

function checkLogin()
{
};

function middleWare($param = "session", $toReturn = [])
{
  global $errors;
  $returnObj = null;
  switch ($param) {
    case "session":
      $uid = trim(filterString($_POST["uid"]));
      $refreshToken = trim(filterString($_POST["refreshToken"]));
      $session = R::findOne(
        "session",
        " uid = ? AND refresh_token = ? AND deleted = ? AND confirmed = ?",
        [$uid, $refreshToken, false, true]
      );
      if ($session && !empty($session)) {
        $user = R::findOne(
          'user',
          ' uid = ? ',
          [$uid]
        );
        if ($user && !empty($user)) {
          $returnObj = array(
            'id' => $user['id'],
            'uid' => $uid,
            'refreshToken' => $refreshToken
          );
        }
      }
      break;
  }
  return $returnObj;
}

<?php

$action = $xs[1];
require_once "./events/onCreateUser.php";

switch ($action) {
  case 'code-sent':
    $phoneNumber = trim(filterString($_POST["phoneNumber"]));
    $codeToken = trim(filterString($_POST["codeToken"]));
    if (!$phoneNumber || strlen($phoneNumber) == 0) {
      $errors["phoneNumber"] = "Use your phone number, Don't be shy. We're a professional app :)";
    }
    if (!$codeToken || strlen($codeToken) == 0) {
      $errors["codeToken"] = "Something went wrong, Please try again later.";
    }
    if (count($errors) > 0) {
      return;
    }
    $user = R::findOne("user", " phone_number = ? ", [$phoneNumber]);
    if ($user && !empty($user)) {
      // User exists - Login
      addSession($user->id, $codeToken);
      $returner = true;
    } else {
      // User doesn't exist - Register
      $emptyUser = R::dispense("user");
      $emptyUser["isVerified"] = false;
      $emptyUser["phoneNumber"] = $phoneNumber;
      R::store($emptyUser);
      addSession($emptyUser->id, $codeToken);
      onCreateUser($emptyUser->id);
      $returner = true;
    }
    break;
  case 'code-verified':
    $phoneNumber = isset($_POST["phoneNumber"]) ? trim(filterString($_POST["phoneNumber"])) : '';
    $codeToken = isset($_POST["codeToken"]) ? trim(filterString($_POST["codeToken"])) : '';
    $uid = trim(filterString($_POST["uid"]));
    $refreshToken = trim(filterString($_POST["refreshToken"]));
    if (
      !$phoneNumber || strlen($phoneNumber) == 0 ||
      !$codeToken || strlen($codeToken) == 0 ||
      !$uid || strlen($uid) == 0 ||
      !$refreshToken || strlen($refreshToken) == 0
    ) {
      $errors["global"] = "Some data are missed";
    }
    if (count($errors) > 0) {
      return;
    }
    $session = R::findOne("session", " code_token = ? AND deleted = ? AND confirmed = ?", [$codeToken, false, false]);
    if ($session && !empty($session)) {
      // Session exists - Go in
      $user = $session->user;
      if ($user["phoneNumber"] !== str_replace('+', '', $phoneNumber)) {
        $errors["global"] = "Phone number and codeToken don't match.";
        return;
      }
      if ($user["isVerified"] == false) {
        $user["isVerified"] = true;
        $user["uid"] = $uid;
        R::store($user);
      }
      $session["confirmed"] = true;
      $session["uid"] = $uid;
      $session["refreshToken"] = $refreshToken;
      R::store($session);
      $returner = true;
    } else {
      // Session doesn't exist
      $errors["global"] = "No session found, try again";
    }
    break;
  case 'get-user-data':
    $userData = null;
    $middleWare = middleWare('session');
    if ($middleWare) {
      $id = $middleWare['id'];
      $uid = $middleWare['uid'];
      $refreshToken = $middleWare['refreshToken'];
      $user = R::load('user', $id);
      $userData = array(
        'fname' => $user['fname'],
        'lname' => $user['lname'],
        'gender' => $user['gender'],
        'uid' => $uid,
        'refreshToken' => $refreshToken
      );
    }
    $returner = $userData;
    break;
  case 'one-more-step':
    $middleWare = middleWare('session');
    if ($middleWare) {
      $fname = trim(filterString($_POST["fname"]));
      $lname = trim(filterString($_POST["lname"]));
      $gender = trim(filterString($_POST["gender"]));
      $genderObj = R::dispense("gender");
      $genderObj = R::findOrCreate("gender", [
        "name" => $gender,
      ]);
      R::store($genderObj);
      $user = R::load('user', $middleWare['id']);
      $user['fname'] = $fname;
      $user['lname'] = $lname;
      $user->gender = $genderObj;
      R::store($user);
      $returner = true;
    }
    break;
  case "login_with_cookie":
    $isLoggedIn = loginWithCookie();
    if ($isLoggedIn) {
      $returner = $isLoggedIn;
    }
    return;
    break;
}

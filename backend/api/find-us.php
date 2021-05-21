<?php

$action = $xs[1];

switch ($action) {
  case 'create':
    $userObj = middleWare("session");
    $feedback = R::dispense('feedback');
    $fullname = trim(filterString($_POST["fullname"]));
    $email = trim(filterString($_POST["email"]));
    $categorySlug = trim(filterString($_POST["categorySlug"]));
    $category = trim(filterString($_POST["category"]));
    $msg = trim(filterString($_POST["msg"]));
    if (!$userObj) {
      $feedback['fullname'] = $fullname;
      $feedback['email'] = $email;
    } else {
      $user = R::load('user', $userObj['id']);
      $feedback->user = $user;
    }
    $categoryObj = R::findOrCreate('feedbackcategory', [
      'slug' => $categorySlug
    ]);
    $categoryObj['name'] = $category;
    R::store($categoryObj);
    $feedback['category'] = $categoryObj;
    $feedback['msg'] = $msg;
    $feedback['createdAt'] = new DateTime();;
    R::store($feedback);
    $returner = true;
    break;
  case "getall":
    $userObj = middleWare("session");
    if (!$userObj) {
      return;
    }
    $feedbacks = R::find("feedback");
    $returner = array_values($feedbacks);
    break;
}

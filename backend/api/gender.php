<?php

$action = $xs[1];

switch ($action) {
  case "getall":
    $userid = middleWare("session");
    if (!$userid) {
      return;
    }
    $genders = R::find("gender");
    $returner = array_values($genders);
    break;
}

<?php

$action = $xs[1];

switch ($action) {
case "getall":
  $userid = middleWare("session");
  if (!$userid) {
    return;
  }
  $tags = R::find("tag");
  $returner = array_values($tags);
  break;
}
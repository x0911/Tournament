<?php

$description = "A sample collection created once you registered on Tournament App. Edit or delete it and start building your tournaments.";
$privacy = "only_me";
$createdAt = new DateTime();

function football() {
  global $description;
  global $privacy;
  global $createdAt;
  $football = R::dispense("collection");
  $football["title"] = "Football";
  $football["description"] = $description;
  $collectionTag = R::dispense("collectiontag");
  $collectionTag["createdAt"] = $createdAt;
  $tag = R::dispense("tag");
  $tag = R::findOrCreate("tag", [
    "name" => "Sports",
  ]);
  $collectionTag->collection = $football;
  $collectionTag->tag = $tag;
  R::store($collectionTag);
  $football["privacy"] = $privacy;
  $football["created_at"] = $createdAt;
  $football["created_by_system"] = true;
  return $football;
}

function history() {
  global $description;
  global $privacy;
  global $createdAt;
  $history = R::dispense("collection");
  $history["title"] = "History";
  $history["description"] = $description;
  $history["privacy"] = $privacy;
  $history["created_at"] = $createdAt;
  $history["created_by_system"] = true;
  return $history;
}

function onCreateUser($userid) {
  if ($userid) {
    $user = R::load("user", $userid);
    $user->xownCollectionList[] = football();
    $user->xownCollectionList[] = history();
    R::store($user);
  }
}
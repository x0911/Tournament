<?php

$action = $xs[1];

switch ($action) {
  case "getall":
    $userObj = middleWare("session");
    if (!$userObj) {
      return;
    }
    $user = R::load("user", $userObj['id']);
    $collections = R::find("collection", " user_id = ? ORDER BY id DESC ", [$userObj['id']]);
    foreach ($collections as $key => $val) {
      $val["owner"] = $user;
      $tags = $val->via("collectiontag")->sharedTagList;
      if ($tags) {
        $tags = array_values($tags);
        $val["tags"] = array_column($tags, "name");
      }
      // $val["questions_count"] = $val->countOwn("question");
    }
    $returner = array_values($collections);
    break;
  case "get":
    $userObj = middleWare("session");
    if (!$userObj) {
      return;
    }
    $id = trim(filterString($_POST["id"]));
    $cExplode = explode("-", $id);
    $cid = $cExplode[count($cExplode) - 1];
    $user = R::load("user", $userObj['id']);
    $collection = R::load("collection", $cid);
    if (!$collection || !$collection["id"] || $collection["user_id"] !== $userObj['id']) {
      $errors["global"] = "This user dosn't own this collection.";
      return;
    }
    $tags = $collection->via("collectiontag")->sharedTagList;
    $tags = array_values($tags);
    $collection["tags"] = array_column($tags, "name");
    $returner = $collection;
    break;
  case "save":
    $userObj = middleWare("session");
    if (!$userObj) {
      return;
    }
    $cid = trim(filterString($_POST["id"]));
    $user = R::load("user", $userObj['id']);
    $collection = R::load("collection", $cid);
    if (!$collection || !$collection["id"] || $collection["user_id"] !== $userObj['id']) {
      $errors["global"] = "This user dosn't own this collection.";
      return;
    }
    $title = isset($_POST["title"]) ? trim(filterString($_POST["title"])) : null;
    $description = isset($_POST["description"]) ? trim(filterString($_POST["description"])) : null;
    $privacy = isset($_POST["privacy"]) ? trim(filterString($_POST["privacy"])) : null;
    $tags = isset($_POST["tags"]) ? trim(filterString($_POST["tags"])) : null;
    if ($tags) {
      $tags = explode($arraySeparator, strtolower($tags));
      $tags = array_unique($tags);
      if (count($tags) > 3) {
        $errors["tags"] = "Maximum available categories for each collection is 3 categories.";
      }
    }
    if ($title && strlen($title) > 50) {
      $errors["title"] = "Title can't be more that 50 characters long.";
    }
    if ($title && strlen($title) > 250) {
      $errors["description"] = "Description can't be more that 250 characters long.";
    }
    if (count($errors) > 0) {
      return;
    }
    $collection["title"] = $title;
    $collection["description"] = $description;
    $collection["privacy"] = !$privacy ? "only_me" : $privacy;
    $collection["updated_at"] = new DateTime();
    R::store($collection);
    R::hunt("collectiontag", " collection_id = ? ", [$collection["id"]]);
    if ($tags) {
      foreach ($tags as $val) {
        $collectionTag = R::dispense("collectiontag");
        $collectionTag["createdAt"] = new DateTime();
        $tag = R::dispense("tag");
        $tag = R::findOrCreate("tag", [
          "name" => $val,
        ]);
        $collectionTag->collection = $collection;
        $collectionTag->tag = $tag;
        R::store($collectionTag);
      }
    }
    $collection["tags"] = $tags;
    $returner = $collection;
    break;
  case "add":
    $userObj = middleWare("session");
    if (!$userObj) {
      return;
    }
    $collection = R::dispense("collection");
    $collection["created_at"] = new DateTime();
    $user = R::load("user", $userObj['id']);
    $user->xownCollectionList[] = $collection;
    R::store($user);
    $returner = $collection["id"];
    break;
}

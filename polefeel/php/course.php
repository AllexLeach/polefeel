<?php
$connection = new PDO("mysql:host=localhost;dbname=polefeel;charset=utf8", "root", "mysql");

print_r($_FILES);
move_uploaded_file($_FILES["file"]["tmp_name"],'../video/'.$_FILES["file"]["name"]);

$params = [
   'name' => $_FILES["file"]["name"],
   'type' => $_FILES["file"]["type"]
];

$sql = "INSERT INTO course_video (name, type) VALUE (:name, :type)";
$query = $connection->prepare($sql);
$query->execute($params);
?>
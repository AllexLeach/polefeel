<?php
function changeLoger($change_action, $change_location) {
   $connection = new PDO("mysql:host=localhost;dbname=polefeel;charset=utf8", "root", "mysql");
   $query = "INSERT INTO `change_log`(`admin`, `change_action`, `location`, `change_data`) VALUES ('".$_COOKIE['adminLogin']."','".$change_action."','"."/polefeel/pages/".$change_location."', '".date("F j, Y, g:i a", $_SERVER['REQUEST_TIME'])."')";
   $connection->query($query);
}

function deleteEblan($eblan, $loc) {
   $connection = new PDO("mysql:host=localhost;dbname=polefeel;charset=utf8", "root", "mysql");
   $query = "DELETE FROM `experimental_subjects` WHERE `fio`="."'".$eblan."'";
   $connection->query($query);
   changeLoger('delete', $loc);
}

function deleteVideo($video, $loc) {
   $connection = new PDO("mysql:host=localhost;dbname=polefeel;charset=utf8", "root", "mysql");
   $query = "DELETE FROM `course_video` WHERE `name`="."'".$video."'";
   $connection->query($query);
   unlink('../video/'.$video);
   changeLoger('delete', $loc);
}

$input_data = $_REQUEST['q'];
$delete_info = explode("/", $input_data);
$locate = array_shift($delete_info);

if ($locate == 'people') {
   deleteEblan(array_pop($delete_info), $locate);
} else if ($locate == 'course') {
   deleteVideo(array_pop($delete_info), $locate);
}
?>
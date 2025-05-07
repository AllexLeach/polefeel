<?php
$connection = new PDO("mysql:host=localhost;dbname=polefeel;charset=utf8", "root", "mysql");

$query = "SELECT * FROM experimental_subjects";
$result = $connection->query($query);
$ajax_answer = '';

while ($row = $result->fetch()) {
   $ajax_answer = $ajax_answer.$row['fio'].'/'.$row['age'].'/'.$row['coment'].'/'.$row['shiz'].';';
}

echo $ajax_answer;
?>
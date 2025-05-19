<?php
$connection = new PDO("mysql:host=localhost;dbname=polefeel;charset=utf8", "root", "mysql");

$input_data = $_REQUEST['q'];
$user_info = explode("/", $input_data);

$params = [
   'fio' => '',
   'age' => '',
   'coment' => '',
   'shiz' => ''
];

$length = count($user_info);
for ($i=0; $i<$length; $i++) {
   if ($i==0) {
      $params['fio'] = $user_info[$i];
   } else if($i==1) {
      $params['age'] = $user_info[$i];
   } else if($i==2) {
      $params['coment'] = $user_info[$i];
   } else {
      $params['shiz'] = $user_info[$i];
   }
}

$sql = "INSERT INTO experimental_subjects (fio, age, coment, shiz) VALUE (:fio, :age, :coment, :shiz)";
$query = $connection->prepare($sql);
$query->execute($params);
?>
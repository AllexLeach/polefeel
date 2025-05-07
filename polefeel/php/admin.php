<?php
function addadmin($us_inf) {
   $connection = new PDO("mysql:host=localhost;dbname=polefeel;charset=utf8", "root", "mysql");
   $params = [
      'login' => '',
      'password' => ''
   ];

   for ($i=0; $i<count($us_inf); $i++) {
      if ($i == 0) {
         $params['login'] = $us_inf[$i];
      } else {
         $params['password'] = $us_inf[$i];
      }
   }

   $sql = "INSERT INTO admins (login, password) VALUE (:login, :password)";
   $query = $connection->prepare($sql);
   $query->execute($params);
}

function showAdmin() {
   $connection = new PDO("mysql:host=localhost;dbname=polefeel;charset=utf8", "root", "mysql");
   $query = "SELECT * FROM admins";
   $result = $connection->query($query);
   $ajax_answer = '';

   while ($row = $result->fetch()) {
      $ajax_answer = $ajax_answer.$row['login'].'/'.$row['password'].';';
   }

   echo $ajax_answer;
}

$input_data = $_REQUEST['q'];
$user_info = explode("/", $input_data);
$action = array_shift($user_info);

if ($action == 'logIn') {
   showAdmin();
}

// $params = [
//    'fio' => '',
//    'age' => '',
//    'coment' => '',
//    'shiz' => ''
// ];

// $length = count($user_info);
// for ($i=0; $i<$length; $i++) {
//    if ($i==0) {
//       $params['fio'] = $user_info[$i];
//    } else if($i==1) {
//       $params['age'] = $user_info[$i];
//    } else if($i==2) {
//       $params['coment'] = $user_info[$i];
//    } else {
//       $params['shiz'] = $user_info[$i];
//    }
// }

// $sql = "INSERT INTO experimental_subjects (fio, age, coment, shiz) VALUE (:fio, :age, :coment, :shiz)";
// $query = $connection->prepare($sql);
// $query->execute($params);
?>
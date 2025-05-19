<?php
function addSession() {
   $connection = new PDO("mysql:host=localhost;dbname=polefeel;charset=utf8", "root", "mysql");
   $params = [
      'name' => $_COOKIE['adminLogin'],
      'start_time' => $_COOKIE['startSessionDate'],
      'end_time' => $_COOKIE['endSessionDate'],
      'time' => $_COOKIE['sessionTime']
   ];

   $sql = "INSERT INTO `sessions_log`(`name`, `start_time`, `end_time`, `time`) VALUES (:name, :start_time, :end_time, :time)";
   $query = $connection->prepare($sql);
   $query->execute($params);
}

function addQueue() {
   $connection = new PDO("mysql:host=localhost;dbname=polefeel;charset=utf8", "root", "mysql");
   $params = [
      'name' => $_COOKIE['adminLogin'],
      'session_state' => True
   ];

   $sql = "INSERT INTO `sessions_queue`(`name`, `session_state`) VALUES (:name, :session_state)";
   $query = $connection->prepare($sql);
   $query->execute($params);
}

function deleteQueue() {
   $connection = new PDO("mysql:host=localhost;dbname=polefeel;charset=utf8", "root", "mysql");
   $sql = "DELETE FROM `sessions_queue` WHERE `session_state`=1";
   $connection->query($sql);
}

function deleteEntityQueue() {
   $connection = new PDO("mysql:host=localhost;dbname=polefeel;charset=utf8", "root", "mysql");
   $sql = "DELETE FROM `sessions_queue` WHERE `name`="."'".$_COOKIE['firstQueue']."'";
   $connection->query($sql);
}

function showQueue() {
   $connection = new PDO("mysql:host=localhost;dbname=polefeel;charset=utf8", "root", "mysql");
   $query = "SELECT * FROM `sessions_queue`";
   $result = $connection->query($query);
   $ajax_answer = '';

   while ($row = $result->fetch()) {
      $ajax_answer = $ajax_answer.$row['name'].'/'.$row['session_state'].';';
   }

   echo $ajax_answer;
}

function addEntityQueue() {
   $connection = new PDO("mysql:host=localhost;dbname=polefeel;charset=utf8", "root", "mysql");
   $params = [
      'name' => $_COOKIE['adminLogin'],
      'session_state' => 0
   ];

   $sql = "INSERT INTO `sessions_queue`(`name`, `session_state`) VALUES (:name, :session_state)";
   $query = $connection->prepare($sql);
   $query->execute($params);
}

function sendMesseng($act) {
   error_reporting(~0);
   ini_set('display_errors', 1);
   // $apiToken = "8077537812:AAHp1kN-VJ5GD_GKCt4z7myRZVdqyfjKLr8";
   // $message = "Это текстовое сообщение отправлено с помощью нашего Telegram-бота";
   // $data = [
   //    'chat_id' => '-1002510993362',
   //    'text' => $message
   // ];
   // $response = file_get_contents("https://api.telegram.org/bot$apiToken/sendMessage?".http_build_query($data));

   $chat_id = "-1002510993362";
   $token = "8077537812:AAHp1kN-VJ5GD_GKCt4z7myRZVdqyfjKLr8";
   if ($act == 'start_session') {
      $textMessage = $_COOKIE['adminLogin']." начал просмотр курсов.\n\nНикому не заходить на SkilBox!!!";
   } else {
      $textMessage = $_COOKIE['adminLogin']." закончил просмотр курсов.\n\nТеперь можно заходить заходить на SkilBox!!!\n\nСледующий в очереди ".$_COOKIE['firstQueue']."!!!";
   }
   $message = urlencode($textMessage);
   $urlQuery = "https://api.telegram.org/bot".$token."/sendMessage?chat_id=".$chat_id."&text=".$message;
   $url = preg_replace('/&/', '&amp;text', $urlQuery);

   $context = stream_context_create(
      array (
          'http' => array (
              'follow_location' => false
          )
      )
  );

   $result = eval(file_get_contents($url, false, $context));
   print_r($result);
}

$action = $_REQUEST['q'];

if ($action == 'end_session') {
   addSession();
   
   deleteQueue();
   deleteEntityQueue();

   // sendMesseng($action);

   setcookie('startSessionDate', '', -1, '/'); 
   setcookie('endSessionDate', '', -1, '/'); 
   setcookie('sessionTime', '', -1, '/');
   setcookie('firstQueue', '', -1, '/');
} else if ($action == 'start_session') {
   addQueue();
   // sendMesseng($action);
} else if ($action == 'show_queue') {
   showQueue();
} else if ($action == 'add_entity_queue') {
   addEntityQueue();
}
?>
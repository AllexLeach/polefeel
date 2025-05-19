<?php
$connection = new PDO("mysql:host=localhost;dbname=polefeel;charset=utf8", "root", "mysql");

$query = "SELECT * FROM course_video";
$result = $connection->query($query);
$ajax_answer = '';

while ($row = $result->fetch()) {
   $name = $row['name'];
   $type = $row['type'];
   $murkdown = <<<GFG
      <div>
         <video width="320" height="240" controls>
            <source src="../video/$name" type="$type">
         </video>
         <button type="btn" class="delete_video" name="$name" style="display: none;">delete</button>
      </div>
   GFG;
   $ajax_answer = $ajax_answer.$murkdown;
}

echo $ajax_answer;
?>
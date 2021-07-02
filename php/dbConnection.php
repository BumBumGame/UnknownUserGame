<?php

$_db_host = 'localhost';
$_db_user = 'UnknownUserGame';
$_db_pass = 'mi0tv99lrYMHkAet';
$_db_name = 'unknownusergame';

$db = new mysqli($_db_host, $_db_user, $_db_pass, $_db_name);

if($db->connect_error){
  die('connection failed'. $db->connect_error);
}

  $db->query("SET NAMES 'utf8'");



function createAndCheckBasicDatabaseStructure($db){
    $sqlStatements = array(
       "CREATE TABLE IF NOT EXISTS User (userID BIGINT NOT NULL AUTO_INCREMENT, userName VARCHAR(255), userPassword VARCHAR (260), userMailAdress VARCHAR(255), PRIMARY KEY (userID))",
    );

    for($i = 0; $i < count($sqlStatements); $i++){
       $db->query($sqlStatements[$i]);
    }
}



function addUserToDatabase($db, $userName, $password, $mailAdress = ""){

  if($mailAdress == ""){$mailAdress = null;};

   $sqlQuery = "INSERT INTO User (userName, userPassword, userMailAdress) VALUES (? , ? , ?)";

   $statement = $db->prepare($sqlQuery);
   $statement->bind_param("sss", $userName, $password, $mailAdress);
   $statement->execute();
   $statement->close();
}

function getUserIdForUserName($db, $userName){

  $sqlQuery = "SELECT userID FROM User WHERE userName = ?";

  $statement = $db->prepare($sqlQuery);
  $statement->bind_param("s", $userName);
  $statement->execute();

  $result = $statement->get_result();
  //Read first Row userID coloumn
  $userID = $result->fetch_assoc()["userID"];

  $statement->close();

  return $userID;
}

function getPasswordForUserID($db, $userID){
  $sqlQuery = "SELECT userPassword FROM User WHERE userID = ".$userID;

  $result = $db->query($sqlQuery);

  $password = $result->fetch_assoc()["userPassword"];

  return $password;
}

function getUserNameCount($db, $userName){
   $sqlQuery = "SELECT COUNT(userName) AS userNameCount FROM User WHERE userName = ?";

   $statement = $db->prepare($sqlQuery);
   $statement->bind_param("s", $userName);
   $statement->execute();

   $result = $statement->get_result();

   $userNameCount =$result->fetch_assoc()["userNameCount"];

   $statement->close();

   return $userNameCount;
}

function userNameExists($db, $userName){
   $userNameCount = getUserNameCount($db, $userName);

   if($userNameCount >= 1){
     return true;
   }else{
     return false;
   }

}

?>

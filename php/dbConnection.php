<?php

class db {

private $_db_host = 'localhost';
private $_db_user = 'UnknownUserGame';
private $_db_pass = 'mi0tv99lrYMHkAet';
private $_db_name = 'unknownusergame';

private $dbKeyObject;


public function __construct(){
   $this->dbKeyObject = new mysqli($this->{"_db_host"}, $this->{"_db_user"}, $this->{"_db_pass"}, $this->{"_db_name"});

  if($this->dbKeyObject->connect_error){
    die('Error: Keine Verbindung zur Datenbank!'. $this->dbKeyObject->connect_error);
  }

    $this->dbKeyObject->query("SET NAMES 'utf8'");
}

public function __destruct(){
  $this->dbKeyObject->close();
}


public function createAndCheckBasicDatabaseStructure(){
    $sqlStatements = array(
       "CREATE TABLE IF NOT EXISTS User (userID BIGINT NOT NULL AUTO_INCREMENT, userName VARCHAR(255), userPassword VARCHAR (260), userMailAdress VARCHAR(255), PRIMARY KEY (userID))",
    );

    for($i = 0; $i < count($sqlStatements); $i++){
       $db->query($sqlStatements[$i]);
    }
}



public function addUserToDatabase($userName, $password, $mailAdress = ""){

  if($mailAdress == ""){$mailAdress = null;};

   $sqlQuery = "INSERT INTO User (userName, userPassword, userMailAdress) VALUES (? , ? , ?)";

   $statement = $this->{"dbKeyObject"}->prepare($sqlQuery);
   $statement->bind_param("sss", $userName, $password, $mailAdress);
   $statement->execute();
   $statement->close();
}

public function getUserIdForUserName($userName){

  $sqlQuery = "SELECT userID FROM User WHERE userName = ?";

  $statement = $this->dbKeyObject->prepare($sqlQuery);
  $statement->bind_param("s", $userName);
  $statement->execute();

  $result = $statement->get_result();
  //Read first Row userID coloumn
  $userID = $result->fetch_assoc()["userID"];

  $statement->close();

  return $userID;
}

public function getPasswordForUserID($userID){
  $sqlQuery = "SELECT userPassword FROM User WHERE userID = ".$userID;

  $result = $this->dbKeyObject->query($sqlQuery);

  $password = $result->fetch_assoc()["userPassword"];

  return $password;
}

public function getUserNameCount($userName){
   $sqlQuery = "SELECT COUNT(userName) AS userNameCount FROM User WHERE userName = ?";

   $statement = $this->dbKeyObject->prepare($sqlQuery);
   $statement->bind_param("s", $userName);
   $statement->execute();

   $result = $statement->get_result();

   $userNameCount = $result->fetch_assoc()["userNameCount"];

   $statement->close();

   return $userNameCount;
}

public function userNameExists($userName){
   $userNameCount = $this->getUserNameCount($userName);

   if($userNameCount >= 1){
     return true;
   }else{
     return false;
   }

}

}

?>

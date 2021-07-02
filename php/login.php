<?php
session_start();

require "dbConnection.php";

if($_SERVER["REQUEST_METHOD"] == "POST"){
   //Check if neccasary Data has been transmitted
    if(!isset($_POST["username"])){
       echo "Error: Kein Benutzername übergeben!";
       exit();
    }else if(!isset($_SERVER["password"])){
       echo "Error: Kein Passwort übergeben!";
       exit();
    }

   //If getData is availalbe
       $userName = trim(htmlspecialchars($_POST["username"]));
			 $inputPassword = trim(htmlspecialchars($_POST["password"]));

      //Check if Fields are empty
      if(strlen($userName) == 0){
        echo "Error: Kein Benutzername eingegeben!";
        exit();
      }else if(strlen($inputPassword) == 0){
        echo "Error: Kein Passwort eingegeben!";
        exit();
      }

       //generate Incoming Password hash
			 $inputPasswordHash = password_hash($inputPassword, PASSWORD_DEFAULT);

       //Connect to Database with Database Object
       $database = new db();

       //Check if Username exists
       if(!$databse->userNameExists($userName)){
         echo "Error: Benutzername nicht gefunden!";
         exit();
       }
       
			 //Extract Password from Database
       $userID = $database->getUserIdForUserName($userName);
       $serverPasswordHash = $database->getPasswordForUserID($userID);

       if(password_verify($inputPassword, $serverPasswordHash)){
         $_SESSION["loggedIn"] = true;
         $_SESSION["loggedInUserID"] = $userID;
         echo "Erfolgreich eingeloggt!";
       }else {
         echo "Error: Falsches Passwort!";
         exit();
       }

}else{
	//Echo Error if no Data was received
  echo "Error: No Post data found!";
}

?>

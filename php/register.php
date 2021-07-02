<?php
session_start();

require "dbConnection.php";

if($_SERVER["REQUEST_METHOD"] == "POST"){

    if(!isset($_POST["username"])){
     echo "Error: Es wurde kein Benutzername übertragen!";
     exit();
   }else if(!isset($_POST["password"])){
     echo "Error: Es wurde kein Password übertragen!";
     exit();
   }else if(!isset($_POST["passwordConfirm"])){
     echo "Error: Es wurde keine Passwort Bestätigung übertragen!";
     exit();
   }

    $userName = trim(htmlspecialchars($_POST["username"]));
    $password = trim(htmlspecialchars($_POST["password"]));
    $passwordCheck = trim(htmlspecialchars($_POST["passwordConfirm"]));
    $mailAdress = trim(htmlspecialchars($_POST["emailAdress"]));

    //Check if passwort and Username are given
    if(strlen($userName) == 0){
       echo "Error: Kein Benutzername angegeben!";
       exit();
    }else if(strlen($password) == 0){
       echo "Error: Kein Passwort angegeben!";
       exit();
    }else if(strlen($passwordCheck) == 0){
       echo "Error: Keine Passwort Bestätigung angegeben";
       exit();
    }

    //Check if passwort Confirm is the same as password
    if($password != $passwordCheck){
       echo "Error: Die beiden Passwörter stimmen nicht überein!";
       exit();
    }
    //Check if Mail is formatted correctly
  if(strlen($mailAdress) != 0){
    if (!filter_var($mailAdress, FILTER_VALIDATE_EMAIL)) {
       echo "Error: Keine richtige Email-Adresse angegeben!";
       exit();
    }
  }

    //Generate Salted password hash
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    //Connect to Database with DatabaseObject
    $database = new db();

    //Check if Username already exists
    if(!$database->userNameExists($userName)){
        $database->addUserToDatabase($userName, $passwordHash, $mailAdress);
       echo "Benutzer erfolgreich erstellt!";
  }else{
     echo "Error: Benutzername existiert bereits!";
     exit();
  }

}else{
  echo "Error: No Post data found!";
}
 ?>

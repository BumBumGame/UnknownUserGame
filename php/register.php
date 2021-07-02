<?php
session_start();

require "dbConnection.php";

if($_SERVER["REQUEST_METHOD"] == "POST"){

    if(!isset($_POST["username"])){
     echo "Error: Es wurde kein Benutzername übertragen!";
     goto end;
   }else if(!isset($_POST["password"])){
     echo "Error: Es wurde kein Password übertragen!";
     goto end;
   }else if(!isset($_POST["passwordConfirm"])){
     echo "Error: Es wurde keine Passwort Bestätigung übertragen!";
     goto end;
   }

    $userName = trim(htmlspecialchars($_POST["username"]));
    $password = trim(htmlspecialchars($_POST["password"]));
    $passwordCheck = trim(htmlspecialchars($_POST["passwordConfirm"]));
    $mailAdress = trim(htmlspecialchars($_POST["emailAdress"]));

    //Check if passwort and Username are given
    if(strlen($userName) == 0){
       echo "Error: Kein Benutzername angegeben!";
       goto end;
    }else if(strlen($password) == 0){
       echo "Error: Kein Passwort angegeben!";
       goto end;
    }else if(strlen($passwordCheck) == 0){
       echo "Error: Keine Passwort Bestätigung angegeben";
       goto end;
    }

    //Check if passwort Confirm is the same as password
    if($password != $passwordCheck){
       echo "Error: Die beiden Passwörter stimmen nicht überein!";
       goto end;
    }
    //Check if Mail is formatted correctly
  if(strlen($mailAdress) != 0){
    if (!filter_var($mailAdress, FILTER_VALIDATE_EMAIL)) {
       echo "Error: Keine richtige Email-Adresse angegeben!";
       goto end;
    }
  }

    //Generate Salted password hash
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    //Check if Username already exists
    if(!userNameExists($db, $userName)){
       addUserToDatabase($db, $userName, $passwordHash, $mailAdress);
       echo "Benutzer erfolgreich erstellt!";
  }else{
     echo "Error: Benutzername existiert bereits!";
     goto end;
  }

}else{
  echo "Error: No Post data found!";
}

end:
$db->close();
 ?>

<?php
session_start();

require "dbConnection.php";

if($_SERVER["REQUEST_METHOD"] == "POST"){
   //If getData is availalbe
       $userName = trim(htmlspecialchars($_POST["username"]));
			 $inputPassword = trim(htmlspecialchars($_POST["password"]));

       //generate Incoming Password hash
			 $inputPasswordHash = password_hash($inputPassword, PASSWORD_DEFAULT);

			 //Extract Password from Database
       $userID = getUserIdForUserName($db, $userName);
       $serverPasswordHash = getPasswordForUserID($db, $userID);

       if(password_verify($inputPassword, $serverPasswordHash)){
         $_SESSION["loggedIn"] = true;
         echo "Erfolgreich eingeloggt!";
       }else {
         echo "Error: Falsches Passwort!";
       }

}else{
	//Echo Error if no Data was received
  echo "Error: No Post data found!";
}

end:
$db->close();

?>

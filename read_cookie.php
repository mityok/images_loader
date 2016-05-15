<?php
include_once("pass.php");
echo PasswordSingleton::getInstance()->getPassword();
//isset(($_COOKIE['_clientInfo']))
/*
if(isset($_COOKIE['_galleryInfo'])){
  $json = $_COOKIE['_galleryInfo'];
  $obj = stripslashes($json);
  echo "<p>Browser Width: " . $obj . "</p>";
}else{
	echo "<p>not set</p>";
}
*/
?>
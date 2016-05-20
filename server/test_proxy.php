<?php
include_once("pass.php");
$before = microtime(true);
$clear=isset($_GET['c'])?htmlspecialchars($_GET['c']):0;
//$href = PasswordSingleton::getInstance()->getPassword();

$proxy = PasswordSingleton::getInstance()->getProxy();
//header("After: ".$proxy);
if($clear){
	PasswordSingleton::getInstance()->clearSession();
}
var_dump($proxy);
$after = microtime(true) - $before;


echo '<br>';
echo $after;
?>
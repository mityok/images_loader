<?php
include_once("pass.php");
$before = microtime(true);
//$href = PasswordSingleton::getInstance()->getPassword();

$proxy = PasswordSingleton::getInstance()->getProxy();
//header("After: ".$proxy);

var_dump($proxy);
$after = microtime(true) - $before;


echo '<br>';
echo $after;
?>
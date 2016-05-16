<?php

include_once("pass.php");
$before = microtime(true);
$proxy = PasswordSingleton::getInstance()->getProxy();
echo $proxy;
$url = "http://jsonplaceholder.typicode.com/posts/1";
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, 1);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 25);
curl_setopt($ch, CURLOPT_PROXY, $proxy);
// Perform the request, and save content to $result
$result = curl_exec($ch);
echo $result;
$after = microtime(true) - $before;
echo $after;


?>
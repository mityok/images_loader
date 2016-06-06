<?php
include_once("pass.php");
$before = microtime(true);
$href = PasswordSingleton::getInstance()->getPassword();
$after = microtime(true) - $before;
$server=isset($_GET['s'])?htmlspecialchars($_GET["s"]):0;
$name=isset($_GET['n'])?htmlspecialchars($_GET["n"]):'img';
$gal=isset($_GET['g'])?htmlspecialchars($_GET["g"]):5;
$count=isset($_GET['c'])?htmlspecialchars($_GET["c"]):1;
$thumb=isset($_GET['m'])?htmlspecialchars($_GET["m"]):1;
$thumb = $thumb?"tn_":"";
$folder = "thumbs";
$server_folder = "server$server";
$full = $thumb?"icons":"images";
$link = "../".$folder.'/'.$server_folder.'/'.$name.'/'.$full.'/'.$thumb.substr($name,0,2) . $gal . 'x' . sprintf("%'.03d", $count ) . '.jpg';
$url = 'http://www.'.$href.($server>0?$server:'').'.com/'.$name.'/'.$thumb.substr($name,0,2) . $gal . 'x' . sprintf("%'.03d", $count ) . '.jpg';
$data = NULL;
header("Content-type: image/jpeg");
if(file_exists($link) && @getimagesize($link)){
	header("Folder: true");
	$data = file_get_contents($link);
	echo $data;
}else{
	header('Durations: '.$after);
	header("Internet: true");
	header("Host: ".$_SERVER['SERVER_NAME']);
	header("Host2: ".$_SERVER['HTTP_REFERER']);
	header("Host3: ".$_SERVER['HTTP_HOST']);
	readfile($url);
	PasswordSingleton::getInstance()->backgroundPost('http://'.$_SERVER['HTTP_HOST'].'/images_loader/server/write_post_thumb.php?link='.urlencode($link).'&url='.urlencode($url).'&dir='.urlencode("../$folder/$server_folder/$name/$full"));
}

//echo $data;
?>
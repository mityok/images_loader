<?php
include_once("pass.php");
$before = microtime(true);
$href = PasswordSingleton::getInstance()->getPassword();

$proxy = PasswordSingleton::getInstance()->getProxy();
header("After: ".$proxy);
$after = microtime(true) - $before;
$server=isset($_GET['s'])?htmlspecialchars($_GET["s"]):0;
$name=isset($_GET['n'])?htmlspecialchars($_GET["n"]):'img';
$gal=isset($_GET['g'])?htmlspecialchars($_GET["g"]):5;
$count=isset($_GET['c'])?htmlspecialchars($_GET["c"]):1;
$thumb=isset($_GET['m'])?htmlspecialchars($_GET["m"]):1;
$thumb = ($thumb==1)?"tn_":"";
$folder = "thumbs";
$server_folder = "server$server";
$full = ($thumb==1)?"icons":"images";
$link = "../".$folder.'/'.$server_folder.'/'.$name.'/'.$full.'/'.$thumb.substr($name,0,2) . $gal . 'x' . sprintf("%'.03d", $count ) . '.jpg';
$url = 'http://www.'.$href.($server>0?$server:'').'.com/'.$name.'/'.$thumb.substr($name,0,2) . $gal . 'x' . sprintf("%'.03d", $count ) . '.jpg';
$data = NULL;
header("Content-type: image/jpeg");
if(file_exists($link) && @getimagesize($link)){
	header("Folder: true");
	$data = file_get_contents($link);
}else{
	header("Internet: true");
	$data = file_get_contents($url, false, $proxy ? stream_context_create(array('http'=>array('method'=>"GET",'proxy' => $proxy))) : NULL);
	if(!is_dir("../$folder/$server_folder/$name/$full")){
		mkdir("../$folder/$server_folder/$name/$full", 0777, true);
	}
	file_put_contents($link, $data);	
}

header('Durations: '.$after);
echo $data;
?>
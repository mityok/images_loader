<?php
include_once("pass.php");
$before = microtime(true);
$href = PasswordSingleton::getInstance()->getPassword();

$server=isset($_GET['s'])?htmlspecialchars($_GET["s"]):0;
$name=isset($_GET['n'])?htmlspecialchars($_GET["n"]):'img';
$href="http://www.".$href.($server>0?$server:'').".com";
$ending = "1.jpg";
$folder = "thumbs";
$server_folder = "server$server";
$link = "../$folder/$server_folder/$name/$name$ending";

header("Content-type: image/jpeg");
$context = NULL;

$data = NULL;
if(file_exists($link) && @getimagesize($link)){
	//die("$link");
	header("Folder: true");
	$data = file_get_contents($link);
}else{
	//die("$href/$name$ending");
	$proxy = PasswordSingleton::getInstance()->getProxy();
	if($proxy){
		$context = stream_context_create(array('http'=>array('method'=>"GET",'proxy' => $proxy)));
	}
	header("Internet: true");
	$data = file_get_contents("$href/$name$ending",false, $context);
	if(!is_dir("../$folder/$server_folder/$name")) mkdir("../$folder/$server_folder/$name", 0777, true);
	file_put_contents($link, $data);
}
$after = microtime(true) - $before;
header('Duration: '.$after);
echo $data;
?>
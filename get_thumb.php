<?php
include_once("pass.php");
$href = PasswordSingleton::getInstance()->getPassword();
$proxy = PasswordSingleton::getInstance()->getProxy();
$server=isset($_GET['s'])?htmlspecialchars($_GET["s"]):0;
$name=isset($_GET['n'])?htmlspecialchars($_GET["n"]):'img';
$href="http://www.".$href.($server>0?$server:'').".com";
$ending = "1.jpg";
$folder = "thumbs";
$link = "$folder/$name/$name$ending";
//die("$href/$name$ending");
header("Content-type: image/jpeg");
$context = NULL;
if($proxy){
		$context = stream_context_create(array('http'=>array('method'=>"GET",'proxy' => $proxy)));
}
if(file_exists($link) && @getimagesize($link)){
	header("Folder: true");
	$data = file_get_contents($link);
	echo $data;
}else{
	header("Internet: true");
	$data = file_get_contents("$href/$name$ending",false, $context);
	if(!is_dir("$folder/$name")) mkdir("$folder/$name");
	file_put_contents($link, $data);
	echo $data;
}
?>
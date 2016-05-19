<?php
class PasswordSingleton{
    /**
     * @var Singleton The reference to *Singleton* instance of this class
     */
    private static $instance;
	
	private static $proxy = 'web-proxy.il.hpecorp.net:8080';
	

	private static $proxyValue = NULL;
	
	private static $userAgent = array("Chilkat/1.0.0 (+http://www.chilkatsoft.com/ChilkatHttpUA.asp)",
"Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; Microsoft; Lumia 640 XL)",
"Mozilla/5.0 (Windows NT 10.0; WOW64; rv:41.0) Gecko/20100101 Firefox/41.0",
"Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36",
"Mozilla/5.0 (iPhone; CPU iPhone OS 9_0 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A342 Safari/601.1");
    /**
     * Returns the *Singleton* instance of this class.
     * @return Singleton The *Singleton* instance.
     */
    public static function getInstance(){
        if (null === static::$instance) {
            static::$instance = new static();
        }
        return static::$instance;
    }
    /**
     * Protected constructor to prevent creating a new instance of the
     * *Singleton* via the `new` operator from outside of this class.
     */
    protected function __construct(){
    }
    /**
     * Private clone method to prevent cloning of the instance of the
     * *Singleton* instance.
     * @return void
     */
    private function __clone(){
    }
    /**
     * Private unserialize method to prevent unserializing of the *Singleton*
     * instance.
     * @return void
     */
    private function __wakeup(){
    }
	
	public function getPassword(){
		if(isset($_COOKIE['_galleryInfo'])){
			$json = $_COOKIE['_galleryInfo'];
			$obj = stripslashes($json);
			if(strlen($obj) === 15){
				return $obj;
			}
			die('wrong cookie');
			return NULL;
		}else{
			die('no cookie');
			return NULL;
		}
    }
	
	public function getProxy(){
		$data=array();
		session_start([
    'cookie_lifetime' => 86400,
]);
		$data['SID']=$_SESSION;
		if(isset($_SESSION['_proxy'])){
			$json = $_SESSION['_proxy'];
			$obj = stripslashes($json);
			$data['pass']=$obj;
			$data['message']='is set';
			return $data;
		}else{
			$timeout = 5;
			$splited = explode(':',static::$proxy);
			$val = NULL;
			$data['message']='not  set';
			if($con = @fsockopen($splited[0], $splited[1], $errorNumber, $errorMessage, $timeout)){
				//proxy works
				$data['message']='not  set working';
				$val = static::$proxy;
			}
			$data['pass']=$val;
			$_SESSION["_proxy"] = $val;
			
			return $data;
		}
		
	}

	public function getUserAgent(){
		return static::$userAgent[mt_rand(0, count(static::$userAgent) - 1)];
	}
	public function generateRandomString($length = 8) {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$charactersLength = strlen($characters);
		$randomString = '';
		for ($i = 0; $i < $length; $i++) {
			$randomString .= $characters[rand(0, $charactersLength - 1)];
		}
		return $randomString;
	}
}
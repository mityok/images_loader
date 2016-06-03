'use strict';
mainApp.service('serverStatusService',function($rootScope, $window, $timeout, $sce){
	var server = null;
	var timer = null;
	$rootScope.itemValidation = null;
	angular.element($window).on('message', onMessage);
	this.setServer = function(srvr){
		if(server != srvr){
			server = srvr;
			openRequestedPopup();
		}
	}
	this.getValidService = function(){
		for(var i=0;i<serverList.length;i++){
			if(serverList[i].validated){
				return serverList[i].url;
			}
		}
	}
	this.getServerList = function(){
		return serverList;
	}
	var serverList=[
		{url:'http://mityok.hostfree.pw/sc/'},
		{url:'http://mityok.byethost4.com/sc/'},
		{url:'http://mityok.rf.gd/sc/'},
		{url:'http://mityok.xp3.biz/sc/'},
		{url:'http://mityok.freehost.tech/sc/'},
		{url:'http://mityok.freehost2.tech/sc/'},
		{url:'http://mityok.esy.es/sc/'},//max seq needs to be low, doesn't work well with large requests
		{url:'remote/',local:true, validated:true}
	];
	function openRequestedPopup() {
		//iframe ng-src
		$rootScope.itemValidation = $sce.trustAsResourceUrl(server.url+'test.html?href='+$rootScope.currentUser+'&src=texasrose&server=2&gallery=2&size=20&rnd='+Math.random());
		timer = $timeout(function(){
			console.log('close');
			if(server){
				server.validated = false;
			}
			$rootScope.itemValidation = '';
		},5000);
	}
	function onMessage(e){
		$timeout.cancel( timer );
		server.validated = false;
		if(e && e.data){
			try{
				var data = JSON.parse(e.data);
				if(data.message=='ok' && data.value==12){
					console.log('ok',data, server);
					server.validated = true;
					console.log(JSON.stringify(serverList));
				}
			}catch(e){
				console.log('error catch',e);
			}
		}else{
			console.log('error',e);
		}
		$rootScope.itemValidation = '';
	}
});
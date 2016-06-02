'use strict';
mainApp.service('serverStatusService',function($rootScope, $window, $timeout, $sce){
	$rootScope.itemValidation = null;
	var serverList=[
		'http://mityok.hostfree.pw/sc/',
		'http://mityok.byethost4.com/sc/',
		'http://mityok.rf.gd/sc/',
		'http://mityok.xp3.biz/sc/',
		'http://mityok.freehost.tech/sc/',
		'http://mityok.esy.es/sc/',//max seq needs to be low, doesn't work well with large requests
		'remote/'
	
	];
	var iframe = null;
	//openRequestedPopup();
	function openRequestedPopup() {
		iframe = document.getElementById('frm');
		$rootScope.itemValidation = $sce.trustAsResourceUrl('http://mityok.freehost.tech/sc/test.html?href='+$rootScope.currentUser+'&src=texasrose&server=2&gallery=2&size=20&rnd='+Math.random());
		angular.element($window).on('message', onMessage);
		$timeout(function(){
			console.log('close');
			$rootScope.itemValidation = '';
		},5000);
	}
	function onMessage(e){
		if(e && e.data){
			try{
				var data = JSON.parse(e.data);
				if(data.message=='ok' && data.value==12){
					console.log('ok',data);
				}
			}catch(e){
				console.log('error',e);
			}
		}else{
			console.log('error',e);
		}
		$rootScope.itemValidation = '';
	}
});
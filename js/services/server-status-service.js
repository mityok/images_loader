'use strict';
mainApp.service('serverStatusService',function($rootScope, $window, $timeout, $sce){
	$rootScope.itemValidation = null;
	var iframe = null;
	openRequestedPopup();
	function openRequestedPopup() {
		iframe = document.getElementById('frm');
		$rootScope.itemValidation = $sce.trustAsResourceUrl('http://mityok.freehost.tech/sc/test.html?href='+'ghjkgh'+$rootScope.currentUser+'&src=texasrose&server=2&gallery=2&size=20&rnd='+Math.random());
		angular.element($window).on('message', onMessage);
		$timeout(function(){
			console.log('close');
			$rootScope.itemValidation = '';
		},10000);
	}
	function onMessage(e){
		console.log('mesg');
		$rootScope.itemValidation = '';
	}
});
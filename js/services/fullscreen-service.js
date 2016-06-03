'use strict';
mainApp.service('fullscreenService',function($timeout,$rootScope){
	function launchIntoFullscreenElement(element) {
		if(element.requestFullscreen) {
			element.requestFullscreen();
		} else if(element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if(element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if(element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	}
	function exitFullscreen(){
		if(document.exitFullscreen) {
			document.exitFullscreen();
		} else if(document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if(document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}
	function toggleFullscreen(){
		console.log('fulls',fullscreenElement());
		if(fullscreenElement()){
			exitFullscreen();
		}else{
			launchIntoFullscreen();
		}
	}
	function launchIntoFullscreen(){
		console.log('fulls ln');
		launchIntoFullscreenElement(document.documentElement);
	}
	function fullscreenEnabled(){
		return document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
	}
	function fullscreenElement(){
		return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
	}
	this.launchIntoFullscreen = launchIntoFullscreen;
	this.toggleFullscreen = toggleFullscreen;
	this.exitFullscreen = exitFullscreen;
	this.fullscreenEnabled = fullscreenEnabled;
	this.fullscreenElement = fullscreenElement;
	//webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange
	document.addEventListener("webkitfullscreenchange", function( event ) {

		console.log('full',fullscreenElement());
		$rootScope.$apply();

	});
});
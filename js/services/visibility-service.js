'use strict';
mainApp.service('visibilityService',function($timeout){
	var title = "Loading...";
	var countTitle = 0;
	var hidden, visibilityChange; 
	if (typeof document.hidden !== 'undefined') {
		hidden = 'hidden';
		visibilityChange = 'visibilitychange';
	} else if (typeof document.mozHidden !== 'undefined') {
		hidden = 'mozHidden';
		visibilityChange = 'mozvisibilitychange';
	} else if (typeof document.msHidden !== 'undefined') {
		hidden = 'msHidden';
		visibilityChange = 'msvisibilitychange';
	} else if (typeof document.webkitHidden !== 'undefined') {
		hidden = 'webkitHidden';
		visibilityChange = 'webkitvisibilitychange';
	}
	function handleVisibilityChange() {
		if (document[hidden]) {
			document.title = 'Paused';
		} else {
			document.title = 'Playing';
		}
	}

	function onBlur() {
		document.body.className = 'blurred';
	};
	function onFocus(){
		document.body.className = 'focused';
	};

	window.onfocus = onFocus;
	window.onblur = onBlur;

	if (typeof document[hidden] === 'undefined') {
		alert('This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.');
	} else {
		// Handle page visibility change   
		document.addEventListener(visibilityChange, handleVisibilityChange, false);
		titleTicker();
	}
	function titleTicker(){
		$timeout(function(){
			countTitle++;
			if(countTitle > title.length-1){
				countTitle = -1;
			}
			document.title = title.substr(countTitle);
			
			titleTicker();
		},400);
	}
});
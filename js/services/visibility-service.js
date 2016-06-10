'use strict';
mainApp.service('visibilityService',function($timeout, $rootScope, $document){
	var title = "Background...";
	var defaultTitle = "Main App";
	var countTitle = 0;
	var timeout = null;
	var documentHidden;
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
			titleTicker();
			countTitle = 0;
			documentHidden = true;
			document.body.style.opacity = 0.0;
    		document.body.style.transform = 'translateZ(0)';
		} else {
			$timeout.cancel(timeout);
			documentHidden = false;
			document.body.style.transform='';
			setTimeout(function(){
				document.body.style.opacity = 1;
			},500);
			document.title = defaultTitle;
		}
		if(!$rootScope.$$phase) {
			$rootScope.$apply();
		}
	}
	this.getDocumentVisiblity = function(){
		return documentHidden;
	}
	function onBlur() {
		documentHidden = false;
		document.body.className = 'blurred';
		if(!$rootScope.$$phase) {
			$rootScope.$apply();
		}
	};
	function onFocus(){
		documentHidden = true;
		document.body.className = 'focused';
		if(!$rootScope.$$phase) {
			$rootScope.$apply();
		}
	};
	window.onfocus = onFocus;
	window.onblur = onBlur;
	if (typeof document[hidden] === 'undefined') {
		alert('This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.');
	} else {
		// Handle page visibility change   
		$document[0].addEventListener(visibilityChange, handleVisibilityChange);
		$timeout(handleVisibilityChange,1);
	}
	function titleTicker(){
		timeout = $timeout(function(){
			countTitle++;
			if(countTitle > title.length-1){
				countTitle = -1;
			}
			document.title = title.substr(countTitle);
			titleTicker();
		},400);
	}
});
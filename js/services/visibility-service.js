'use strict';
mainApp.service('visibilityService',function($timeout, $rootScope){
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
		} else {
			$timeout.cancel(timeout);
			documentHidden = false;
			setTimeout(function(){
				document.body.style.opacity = 1;
			},100);
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
		handleVisibilityChange();
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
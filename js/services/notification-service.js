'use strict';
mainApp.service('notificationService', function($timeout, TOAST_LENGTH_SHORT, TOAST_TYPE_INFO){
	var _scope = null;
	var playTimer = null;
	function cancel(){
		$timeout.cancel(playTimer);
	}
	this.show = function(message,type,time){
		var duration = time || TOAST_LENGTH_SHORT;
		var notificationType = type || TOAST_TYPE_INFO;
		_scope.show = false;
		 $timeout(function(){
			_scope.show = true;
			_scope.message = message;
			_scope.type = notificationType;
			_scope.duration = duration/1000;
		},10);
	};
	this.init = function(scope){
		_scope = scope;
	}
});
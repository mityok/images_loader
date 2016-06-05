mainApp.directive('console',['$window',function($window ){
	return {
		restrict: 'EA',
		scope:{},
		template:'<textarea ng-model="myTextarea"></textarea><div></div>',
		controller:function($scope){
			var MAX_LENGTH = 200;
			(function init(){
				if($window.console && console.log){
					var old = console.log;
					console.log = function(){
						var arg=arguments;
						$scope.$applyAsync(function(){
							var str=JSON.stringify(arg);
							if (str.length > MAX_LENGTH) {
								str= str.substr(0, MAX_LENGTH/2 - 2) + ' ... ' + str.substr(str.length - MAX_LENGTH/2 - 3, str.length);
							}
							$scope.myTextarea += str+'\r\n-------\r\n';
						})
						old.apply(this, arguments)
					}
				}  
			})();
		}
	}
}]);
mainApp.directive('console',['$window','$timeout','$rootScope',function($window, $timeout, $rootScope ){
	return {
		restrict: 'EA',
		scope:{},
		template:'<textarea ng-model="myTextarea"></textarea><div></div>',
		link:function(scope, element, attrs){
			scope.textarea= element.find('textarea')[0];
		},
		controller:function($scope){
			var MAX_LENGTH = 200;
			function scrollTop(){
				$timeout(function(){
					$scope.textarea.scrollTop = $scope.textarea.scrollHeight;
				},100);
			}
			function shorten(str){
				if (str.length > MAX_LENGTH) {
					str= str.substr(0, MAX_LENGTH/2 - 2) + ' ... ' + str.substr(str.length - MAX_LENGTH/2 - 3, str.length);
				}
				return str;
			}
			$scope.$watch(function(){return $rootScope.consoleShow},function(newVal){
				if(newVal){
					scrollTop();
				}
			});
			function parseStack(stack,ctor){
				var err = stack.split(/\r?\n|\r/g);
				for(var i=0;i<err.length;i++){
					if(err[i].indexOf(ctor)<0 && err[i].indexOf('Error')<0){
						stack=err[i].trim();
						var arr =stack.split(' ');
						//remove 'at'
						arr.shift();
						var file = arr.pop();
						file.replace('(','');
						file.replace(')','');
						var fileUrl= file.split('/');
						var url = fileUrl[fileUrl.length-1];
						var arrUrl = url.split(':');
						file=arrUrl[0];
						var num = arrUrl[1];
						return arr.join(' ')+' @ '+ file+":"+num;
					}
				}
			}
			(function init(){
				if($window.console && console.log){
					var old = console.log;
					console.log = function(){
						var arg = arguments;
						var stack = parseStack(new Error().stack,this.constructor.name);
						
						$scope.$applyAsync(function(){
							var str='';
							for(var k in arg){
								str+=shorten(JSON.stringify(arg[k]))+' - ';
							}
							$scope.myTextarea += str+ stack+'\r\n-------\r\n';
							scrollTop();
						})
						old.apply(this, arguments);
					}
				}
			})();
		}
	}
}]);
angular.module('starter.services')

.factory('Navigator', function($rootScope, $state){
	//private
	var lastStateName = '';
  	var lastStateParams = {};

	$rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
		lastStateName = from.name;
		lastStateParams = fromParams;
	});

	return {
		goBack: goBack
	}

	function goBack() {
		$state.go(lastStateName, lastStateParams);
	}

})
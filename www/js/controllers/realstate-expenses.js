angular.module('starter.controllers')

.controller('RealstateExpensesController', function($scope, $stateParams, RealStates, $translate){
	$scope.year = new Date().getFullYear();
	RealStates.get($stateParams.realstateId).then(function(realstate){
		$scope.realstate = realstate;
	})

	RealStates.expenses($stateParams.realstateId, $scope.year).then(function(expanses){
		$scope.expenses = expanses;
	})

	$scope.getIcon = function () {

	  if ($translate.use() === 'ar') {
	    return 'ion-chevron-left'
	  }
	  return 'ion-chevron-right'
	}

})
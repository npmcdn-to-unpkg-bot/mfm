angular.module('starter.controllers')

.controller('RealstateIncomeController',  function($scope, $stateParams, RealStates, $translate){
	$scope.year = new Date().getFullYear();
	RealStates.get($stateParams.realstateId).then(function(realstate){
		$scope.realstate = realstate;
	})
	RealStates.income($stateParams.realstateId, $scope.year).then(function(incomeModel) {
		$scope.incomeModel = incomeModel;
	});

	$scope.getIcon = function () {

	  if ($translate.use() === 'ar') {
	    return 'ion-chevron-left'
	  }
	  return 'ion-chevron-right'
	}
})
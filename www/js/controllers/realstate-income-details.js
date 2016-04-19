angular.module('starter.controllers')

.controller('RealstateIncomeDetailController',  function($scope, $stateParams, $translate, RealStates){
	$scope.year = new Date().getFullYear();
	$scope.month = $stateParams.month;
	$scope.year = $stateParams.year;

	RealStates.incomeDetails($stateParams.realstateId,$scope.year, $scope.month)
	.then(function(data){
		$scope.details = data.details;
		$scope.monthSum = data.monthSum;
	})

	$scope.getIcon = function () {
	  if ($translate.use() === 'ar') {
	    return 'ion-chevron-left'
	  }
	  return 'ion-chevron-right'
	}
})

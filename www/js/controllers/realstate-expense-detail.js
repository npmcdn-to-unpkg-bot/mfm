angular.module('starter.controllers')

.controller('RealstateExpenseDetailController', function($scope, $stateParams, $translate, RealStates){
	$scope.month = $stateParams.month;
	$scope.year = $stateParams.year;

	RealStates.expenseDetails($stateParams.realstateId,$scope.year, $scope.month)
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
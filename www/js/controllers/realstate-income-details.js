angular.module('starter.controllers')

.controller('RealstateIncomeDetailController',  function($scope, $stateParams, $translate, $location, Contracts){
	$scope.year = new Date().getFullYear();
	$scope.month = $stateParams.month;
	$scope.year = $stateParams.year;

	Contracts.findAllByRealstateId($stateParams.realstateId, $scope.month, $scope.year).then(function(data){
		$scope.contracts = data.contracts;
		$scope.monthSum = data.monthSum;
		if($location.search().allDays === "true") {
			data.contracts.push({
				startDate : new Date($scope.year, $scope.month, 1),
				endDate : new Date($scope.year, $scope.month, 30),
				grandTotal : 30 * 250,
			});
			$scope.monthSum = data.contracts[0].grandTotal;
		}
	})

	$scope.getIcon = function () {
	  if ($translate.use() === 'ar') {
	    return 'ion-chevron-left'
	  }
	  return 'ion-chevron-right'
	}
})


angular.module('starter.controllers')

.controller('RealstateDetailController', function($scope, $stateParams, RealStates, Contracts) {
	$scope.incomeToggle = false;
	$scope.expansesToggle = false;
	

	RealStates.get($stateParams.realstateId).then(function(realstate){
		$scope.realstate = realstate;
		$scope.viewTitle = $scope.realstate.name;


		Contracts.findByRealstateId(realstate.id).then(function(contract){
			$scope.currentContract = contract;
		})
	
	});

	$scope.toggleIncome = function(){
		$scope.incomeToggle =  !$scope.incomeToggle;
	}
	
	$scope.toggleExpanses = function(){
		$scope.expansesToggle =  !$scope.expansesToggle;
	}
	
	$scope.finishContract = function() {
		Contracts.finish($scope.currentContract.id);
	}


})

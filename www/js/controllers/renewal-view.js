angular.module('starter.controllers')

.controller('RenewalViewController', function($scope, $stateParams, Renewals, Contracts){
	$scope.stateParams = $stateParams;
	Renewals.find($stateParams.renewalId).then(function(renewalModel){
		$scope.renewal = renewalModel;
	});
	
})
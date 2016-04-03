angular.module('starter.controllers')


.controller('ContractViewController', function($scope, $stateParams, Contracts, $filter){
	//
	$scope.view = { title : 'Contract' };
		console.log($scope.title);
	Contracts.find($stateParams.contractId, ['renter', 'realstate', 'broker', 'renewals']).then(function(contract){
		$scope.contract = contract;
		$scope.view.title = 'Contract #' + contract.id + ' [ ' + $filter('date')(contract.contractDate,'d/M/yyyy') + ' ]';
		console.log($scope.title);
	});

	
	$scope.getReport = function(){
	 	document.getElementById("jsrForm").submit();
	 }

	$scope.getContractName = function(){
		if($scope.contract)
		{
			contractName = 'contract_';
			if($scope.contract.contractDate)
				contractName += moment($scope.contract.contractDate).format('DD_MM_YYYY') + '_' ;
			if($scope.contract.realstate && $scope.contract.realstate.name)
				contractName += $scope.contract.realstate.name.replace(' ', '_') + '_' ;
			if($scope.contract.renter)
				contractName += $scope.contract.renter.name.replace(' ', '_');
			return contractName;
		}
	}
})
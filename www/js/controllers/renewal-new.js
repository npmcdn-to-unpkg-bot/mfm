
angular.module('starter.controllers')

// New renewal controller
.controller('RenewNewController', function($scope, $stateParams, $state, Contracts, Renewals, Navigator, $filter, toastr){
	console.log($stateParams.contractId);
	$scope.isNew = true;
	var latestEndDate;

	$scope.model = { 
		id: 0,
		renewalDate: new Date(),
		endDate: new Date(),
	};

	Contracts.find($stateParams.contractId, ['realstate', 'renewals']).then(function(contract) {

		$scope.model.contractID = contract.id;
		$scope.contract = contract;
	    $scope.model.durationInDays = 10;
	    // 
	    if(contract.renewals.length) 
	    	latestEndDate = contract.renewals[contract.renewals.length-1].endDate;
	    else
			latestEndDate = contract.endDate;
	    
	});

	$scope.renew = function () {
		// adding startDate to renewal model
		$scope.model.startDate = latestEndDate;

		Renewals.save($scope.model).then(function(renewal) {
			toastr.success($filter('translate')('renewalNew.msgRenewSuccess'));
			Navigator.goBack();
			return renewal;
		});
	}

	$scope.$watch('model.durationInDays', function (newValue) {
		if($scope.contract && $scope.contract.realstate){
		$scope.model.endDate = Contracts.addDays(latestEndDate, newValue);
	   		$scope.model.total = $scope.model.durationInDays * $scope.contract.realstate.rentalFees;
		}
	});

})

// Edit renewal controller
.controller('RenewalEditController', function($timeout, $scope, Navigator, $stateParams, Contracts, Renewals, $ionicPopup, $filter, toastr){
	var lastStateName = '';
	var lastStateParams = {};
	$scope.isEdit = true;

	Renewals.find($stateParams.renewalId).then(function(renewalModel){
		$scope.model = renewalModel;
	});

	Contracts.find($stateParams.contractId, ['realstate', 'renewals']).then(function(contract) {
		$scope.contract = contract;

		latestEndDate = contract.endDate;
		if(contract.renewals.length > 1) { 
			var renewals = contract.renewals.sort(compare);
	    	latestEndDate = renewals[contract.renewals.length-2].endDate;
	    }

	});

	$scope.update = function () {
		Renewals.update($scope.model).then(function(renewal) {
			toastr.success($filter('translate')('renewalNew.msgUpdateSuccess'));
			Navigator.goBack();
			return renewal;
		});
	}

	$scope.$on('$destroy', function () {
		console.log('💀')
	});

	$scope.remove = function () {
		var confirmPopup = $ionicPopup.confirm({
			title: $filter('translate')('renewalNew.popupTitle'),
			template: $filter('translate')('renewalNew.popupTemplate'),
			cancelText: $filter('translate')('renewalNew.cancel'),
       		okText: $filter('translate')('renewalNew.ok')
		});
		confirmPopup.then(function(res){
			if(res) {
				Renewals.remove($scope.model).then(function(renewal) {
					toastr.success($filter('translate')('renewalNew.msgRemoveSuccess'));
					Navigator.goBack();
					return renewal;
				});
			}
		})
	}

	$scope.$watch('model.durationInDays', function (newValue) {
		// wait unit  it came!
		if($scope.contract && $scope.contract.realstate){
			$scope.model.endDate = Contracts.addDays(latestEndDate, newValue);
	   		$scope.model.total = $scope.model.durationInDays * $scope.contract.realstate.rentalFees;
		}
	});



	function compare(a, b){
		if(a.endDate > b.endDate)
			return 1;
		else if (a.endDate < b.endDate)
			return -1;
		else 
			return 0;
	}

});































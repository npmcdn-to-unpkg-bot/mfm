angular.module('starter.controllers')

.controller('ContractController', function($scope, $stateParams, RealStates, WizardHandler, $ionicModal, 
	PeopleServices, $filter, JSReport, $sce, Contracts, $state, RealstateDetailsService) {


	$scope.model = {
		contractDate: new Date(),
		durationInDays: 10,
		startDate: new Date(),
		endDate: Contracts.addDays(new Date(), 10),
		brokerCommission: 10,
		realstate: {
			rentalFees: 250	
		},
		companions: [],
		companionLimit: 3,
		discount: 0,

	};

	RealStates.get($stateParams.realstateId).then(function(realstate){
		$scope.model.realstate.name = realstate.name;
		$scope.model.realstate = realstate;
		console.log(realstate);
	});

	// Add companion
	$scope.addCompanion = function() {
		$scope.model.companions.push({
			id: $scope.model.companions.length + 1,
			name: '',
			phone: ''
		})
	}

	// Remove companion
	$scope.removeCompanion = function(companion) {
		var index = $scope.model.companions.indexOf(companion);
		$scope.model.companions.splice(index, 1);
	}

	console.log($scope.model.realstate);
	//
	$scope.readOnly = false;
	var _people;

	// ------------------ WIZARD ------------------
	//Wizard navigation
	$scope.next = function(){
		WizardHandler.wizard().next();
		WizardHandler.curr
	} 

	$scope.previous = function(){
		WizardHandler.wizard().previous();	
	}

	// --------------- PEOPLE MODEL ---------------
	//Select renter model
	$ionicModal.fromTemplateUrl('templates/contracts/person-select-modal.html', {
	   scope: $scope,
	   animation: 'slide-in-up'
	 }).then(function(modal) {
	   $scope.modalPeople = modal
	 })  
	 // Companion modal
	$ionicModal.fromTemplateUrl('templates/contracts/companion-add-modal.html', {
	   scope: $scope,
	   animation: 'slide-in-up'
	 }).then(function(modal) {
	   $scope.modalCompanion = modal
	 })  
	 // New person modal
	$ionicModal.fromTemplateUrl('templates/contracts/person-new-modal.html', {
	   scope: $scope,
	   animation: 'slide-in-up'
	 }).then(function(modal) {
	   $scope.modalNewPerson = modal
	 })  



	 //Filter people by type
	 function filterPeople() {
	 	$scope.people = $filter('filter')(_people, {'name': $scope.modalPeople.inputFilter, 'type': currentPeopleType});
	 }

	 $scope.onPeopleFilterChange = function() {
	 	filterPeople();
	 	if($scope.people.length <= 1) {
	 		console.log('you should get more people from backend!');
	 		getPeopleList($scope.modalPeople.inputFilter, currentPeopleType);
	 	}
	 }

	 //hold the current person type
	 var currentPeopleType = null;
	 
	 $scope.openModalPeople = function(type) {
	 	currentPeopleType = type === undefined ? 'renter' : type;
	 	$scope.newPersonLabel = type === 'renter' ? 'New renter' : 'New broker';
	 	//initial list
	 	if($scope.people === undefined){
	 		// console.log('getting people for the first time!');
			getPeopleList(undefined, currentPeopleType);
	 	}

	   $scope.modalPeople.show();
	   filterPeople()
	 }

	 $scope.closeModalPeople = function(person) {
	 	if(person){
		 	if(currentPeopleType === 'renter'){
			  	$scope.model.renter = person;
			  	$scope.readOnly = true;
		 	}
		 	else{
		 		$scope.model.broker = person;
			  	$scope.readOnlyBroker = true;
			  	$scope.clalculateTotal();
		 	}
	 	}

	 	currentPeopleType = null;
	 	$scope.modalPeople.inputFilter = '';
	 	$scope.people = null;
	   	$scope.modalPeople.hide();
	 };

	 $scope.openModalCompanion = function() {
	 	$scope.modalCompanion.show();
	 }

	 $scope.openModalNewPerson = function() {
	 	$scope.modalNewPerson.show();
	 }

	 $scope.closeModalNewPerson = function() {
	 	$scope.modalNewPerson.hide();
	 	$scope.modalNewPerson.new.type = currentPeopleType;
	 	PeopleServices.create($scope.modalNewPerson.new).then(function(newPerson){
			// $scope.people.push(newPerson);
			$scope.closeModalPeople(newPerson);

			// clear staff
		 	$scope.modalNewPerson.new.name = null;
		 	$scope.modalNewPerson.new.phone1 = null;
		 	$scope.modalNewPerson.new.type = null;
		 	$scope.modalNewPerson.new.address = null;
	 	});
	 }

	 $scope.closeModalCompanion = function() {
	 	$scope.modalCompanion.hide();
	 	$scope.model.companions.push($scope.modalCompanion.new);
	 	$scope.modalCompanion.new.name = null;
	 	$scope.modalCompanion.new.phone = null;
	 }

	 $scope.cancelModalCompanion = function() {
	 	$scope.modalCompanion.hide();
	 
	 }
	 $scope.cancelModalNewPerson = function() {
	 	$scope.modalNewPerson.hide();
	 }

	 $scope.$on('$destroy', function() {
	   $scope.modalPeople.remove();
	   $scope.modalCompanion.remove();
	 });

	// ------------------ WATCHERS ------------------
	// Durations
	 // $scope.$watch('model.renter.idDateOfIssue', function (newValue) {
	     // $scope.model.formatedIdDateOfIssue = $filter('date')(newValue, 'yyyy/MM/dd'); 
	     // $scope.model.renter.formatedIdDateOfIssue = new Date(newValue); 
	 // });

	 $scope.$watch('model.durationInDays', function (newValue) {
	    $scope.model.endDate = Contracts.addDays($scope.model.startDate, newValue); 
	 	$scope.clalculateTotal();
	 });

	 $scope.$watch('model.startDate', function (newValue) {
	     $scope.model.endDate = Contracts.addDays(newValue, $scope.model.durationInDays); 
	 });


	 $scope.endDateChanged = function(){
	 	var timeDiff = Math.abs(new Date($scope.model.startDate).getTime() - new Date($scope.model.endDate).getTime() );
        var days = Math.ceil(timeDiff / (1000 * 3600 * 24));
	 	$scope.model.durationInDays = days;
	 }


	 $scope.clalculateTotal = function clalculateTotal() {
	    $scope.model.total = $scope.model.durationInDays * $scope.model.realstate.rentalFees;
	 	$scope.model.grandTotal = $scope.model.total;
	 	if($scope.model.discount > 0){
	 		$scope.model.grandTotal -= $scope.model.discount;	
	 	}
	 	if($scope.model.broker){
	  	 	$scope.model.brokerFees = ($scope.model.brokerCommission / 100) * $scope.model.total;
	 		$scope.model.grandTotal -= $scope.model.brokerFees;
	 	}
	 }

	 function getPeopleList(_filter, _type){	 
	 	PeopleServices.all(_filter?_filter:undefined, _type).then(function(list){
	 		_people = list;
	 		filterPeople();
	 	});
	 }
	 
	 $scope.reportData = {
        contractDate: "الخميس",
        "renter":{
            "name": "محمد عمر",
            "phone1": "٠٩١٢٣٣٤٤٥٥",
            "address": "الخرطوم-بري"
	 }
	}

	 

     $scope.save = function(){
     	//fix companions
     	for(var i = 0; i < $scope.model.companions.length; i++){
     		$scope.model['companion'+(i+1)+'name'] = $scope.model.companions[i].name; 
     		$scope.model['companion'+(i+1)+'phone'] = $scope.model.companions[i].phone; 
     	}
     	
		Contracts.save($scope.model).then(function(contract){
			RealstateDetailsService.refreshData();
			$state.go('app.contract-view', {contractId: contract.id});
		}); 
	}

});

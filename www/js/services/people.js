angular.module('starter.services')

.factory('PeopleServices', function(Restangular){

	var _peopleService = Restangular.service('/People');
	var _people ;
	return {
		all: function(_filter, _type){
			var qry;
			console.log(_filter);
			if(_filter){
				qry = {
					filter: JSON.stringify({
							where: {
								or: [
									{ name: { regexp : '^' + _filter + '/i' } }, 
									{ phone1: { regexp : '^' + _filter + '/i' } } 
								],
								and: [
									{ type: _type }
								]},
							// fields: {name: true, phone1: true},
							limit: 1
						})
				};				
			}
			return _peopleService.getList(qry).then(function(list){
				_people = Restangular.stripRestangular(list);
				return _people;
			});
		},
		get: function(id){

		},
		create: function(person){
			return _peopleService.post(person).then(function(_person){
				return Restangular.stripRestangular(_person);
			})
		},
		update: function(id, person){

		},
		delete: function(id){

		}

	};
});

function where (_key, value, _fields, limit){

	var qry = {};

	if(value){
 	qry.where = {};
 	qry.where[_key] = { regexp : '^' + value + '/i' };
	}

	if(_fields){
 	//if fieds not meput
 	qry.fields = {};
	//adding fileds to be fetched
	for(var i =0 ; i < _fields.length; i++){
		qry.fields[_fields[i]] = true;
	}
	}

	if(limit)
		qry.limit = limit;

	//make qry string  json as specified on strongloop docs
	qry = {filter : JSON.stringify(qry)};

	console.log(qry)

	return qry;
}

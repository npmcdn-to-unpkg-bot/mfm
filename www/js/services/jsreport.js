/**
* starter.services Module
*
* Description
*/
angular.module('starter.services')
.factory('JSReport', function($http) {

	//private
	var _print ;
	var reportUrl = "https://192.168.1.6:4430/api/report";
	
	return function (parameter) {
        return $http.post(reportUrl, parameter, { responseType: 'arraybuffer' }).success(function (response) {
            return response;
        });
    };


})
/** @exports BatchRequest */

/**
 * Note: Batch request is a pro feature and will not work if your user account
 * does not have the correct permissions. 
 * 
 * @description - Builds a single request object to be passed into the Vehicle class
 * to allow submitting multiple requests to different endpoints. 
 * 
 * @constructor
 * @return {Object} 
 */

function BatchRequest() {

}

/**
* @param {String} Endpoint - The Smartcar endpoint to retrieve data from
* @param {Object} [headers] - Optional headers to be passed in. You may use the Smartcar
* [headers](https://smartcar.com/docs/api#headers) as a default
* 
* @example
* ('/location', { headers });
* @return {Object} A batch request object
*/


BatchRequest.prototype.addRequest = function(endpoint, headers) {

}
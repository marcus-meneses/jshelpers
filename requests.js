//helper functions from around the web


function isObject (item) {
  return (typeof item === "object" && !Array.isArray(item) && item !== null);
}


/*
REST APIS wrapper object
author: Marcus Vinícius Martins Meneses
for VOA Studio -> http://voastudio.tech
*/


// 'default_url':'http://174.138.72.41:3000/',
// 'default_url':'http://127.0.0.1:3000/',

var requests_configuration = 	{	'default_url':'http://174.138.72.41:3000/',
									'description':'REST API for APPS'
								};

var requests_routes = {
	'login':{'route':'login','param-min':2,'param-max':2,'method':'POST'},
	'tokenlogin':{'route':'loginbytoken','param-min':1,'param-max':2,'method':'POST'},
	'mailexists':{'route':'mailexists','param-min':2,'param-max':2,'method':'POST'},
	'register':{'route':'cadastrausuario','param-min':2,'param-max':2,'method':'POST'},
	'listacategorias':{'route':'listacategoria/{1}','param-min':0,'param-max':1,'method':'POST'},
	'listaprodutos':{'route':'listaproduto/{1}/{2}','param-min':0,'param-max':1,'method':'POST'},
	'listafotos':{'route':'listafoto/{1}','param-min':0,'param-max':1,'method':'POST'},
	'cadastra':{'route':'cadastrausuario','param-min':6,'param-max':7,'method':'POST'},
}	

var TRequests = function() {
  this.root = requests_configuration.default_url;
  this.routes = JSON.parse(JSON.stringify(requests_routes)); 
  this.description = requests_configuration.description;
  this.resultSet = {}; 
 

this.refresh_routes=function(){
  this.routes = JSON.parse(JSON.stringify(requests_routes));
  console.log(this.routes);
}

 console.log('objeto Requests pronto');
};


TRequests.prototype.setArgs = function(route,arglist){
this.refresh_routes();



for (var ind=1; ind<=arglist.length;ind++) {
this.routes[route].route = this.routes[route].route.replace('{'+ind+'}', arglist[ind-1]);
}


}


TRequests.prototype.handle = function(state, status, response ) { //error catch-all handler

//PLEASE, override this function
//console.log('awful error, sir.');

console.log('state:');
console.log(state);
console.log('status:');
console.log(status);
console.log('response:');
console.log(response);

return 0;

}

TRequests.prototype.error = function(e) { //error catch-all handler

//PLEASE, override this function
//console.log('awful error, sir.');

console.log(e);


return 0;

}




TRequests.prototype.run = function(route, params, values, callback) {

var retainment = this;	

var cannonical="";
var maxparams = this.routes[route].maxparams;
var minparams = this.routes[route].minparams;


if (this.routes[route]===undefined) {
	return 0; 
} else {

		//validate parameters count
			if ((params.length<minparams) || (params.length>maxparams)) {
				this.handle('contagem inconsistente de campos');
				return 0;
			}

		//validate values count
			if (params.length!=values.length) { 
				this.handle('contagem inconsistente de campos e valores');
				return 0;
			}

//build the url data
var urldata = "autogen=true";
for (var i=0; i<params.length; i++){
urldata = urldata+'&'+params[i]+"="+values[i];
}




//build the route
cannonical = this.root+this.routes[route].route;
console.log('url: ' + cannonical);
console.log('urldata: ' + urldata);

 	var http = new XMLHttpRequest();


	if (this.routes[route].method=="POST") {
	  http.open("POST", cannonical, true);

	} else if (this.routes[route].method=="GET") {
	  http.open("GET", cannonical, true);

	}

 http.onreadystatechange = function() {
    if(http.readyState == 4 && http.status == 200) {
    	//retainment.handle(http.responseText);
       callback(http.responseText);
    } else {
    	retainment.handle(http.readyState, http.status, http.responsetext);
    }
 }


http.onerror = function (e) {

	retainment.error(e);

//console.log(e);

}


http.ontimeout = function (e) {
	retainment.error(e);

//console.log(e);
}


 http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
 http.send(urldata);




}



}





var Requests= new TRequests();







 // Send the proper header information along with the request
 //http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
 //http.setRequestHeader("Content-Length", params.length);// all browser wont support Refused to set unsafe header "Content-Length"
 //http.setRequestHeader("Connection", "close");//Refused to set unsafe header "Connection"

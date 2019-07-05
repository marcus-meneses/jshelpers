//helper functions from around the web


function isObject (item) {
  return (typeof item === "object" && !Array.isArray(item) && item !== null);
}


/*
webSql wrapper object
author: Marcus Vinícius Martins Meneses
for VOA Studio -> http://voastudio.tech
*/

var configuration = 	{	'name':'waveMedicalData',
				'version':'1.0',
				'description':'Database para aplicação waveMedical',
				'size':2
			};
			
			
var tables = { 
		'configuration':[
				'remoteid TEXT NOT NULL',
				'logintoken TEXT NOT NULL',
				'category TEXT NOT NULL',
				'name TEXT NOT NULL',
				'categoria_id TEXT NOT NULL'
			],
		'lista':[
				'produto INTEGER NOT NULL',
				'categoria INTEGER NOT NULL',
				'nome TEXT NOT NULL'
		]
		};
			

var TDatabase = function() {
  this.name = configuration.name;
  this.version = configuration.version;
  this.description = configuration.description;
  this.size = configuration.size * 1024 * 1024;  //config.size is given in MB, converted to bytes
  this.currentTable = '';
  this.internalDB = {};
  this.resultSet = {};
  
  //this.logstring = '' ;
  
 
};



TDatabase.prototype.handle = function( e ) { //error catch-all handler

if (e===null) {
 console.log('erro desconhecido');
} else {

	if (isObject(e)) {
	      
	       console.log('Why am I here?');
	 
	} else {
		console.log('ERRO ');
 		console.log(e);
 	}
}

return 0;

}


TDatabase.prototype.useTable = function(table) {

 var tablesLength = Object.keys(tables).length;
 
 var check=false;
 
 for (var i=0; i<tablesLength; i++) {
 
 	if (table==Object.keys(tables)[i]) check=true;
 
 }

	if (check==true) {
		this.currentTable = table;
	} else {
		this.handle();
		return 0;
	}


}


TDatabase.prototype.initialize = function( chain ){

//error-check

 if (!window.openDatabase) {
            this.handle("Seu navegador não suporta banco de dados.");
 }
 
 

this.internalDB = openDatabase(this.name, this.version, this.description, this.size, this.handle );

//shit-check
    if(!this.internalDB){
       this.handle("Impossível criar banco de dados");
    }else{
	console.log('Database '+this.name+' pronto');
    }
    



this.create(chain);

}


TDatabase.prototype.create =function( callback ){

 

var tablesLength = Object.keys(tables).length;

createstring = [];
for (var i = 0; i < tablesLength; i++) {
createstring[i]='';
}

for (var i = 0; i < tablesLength; i++) {
var key = Object.keys(tables)[i];
createstring[i] = createstring[i] + ' CREATE TABLE IF NOT EXISTS '+key+'(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT';

	for (var j=0; j<tables[key].length;j++) {
	 createstring[i]=createstring[i]+', '+tables[key][j];
	}
createstring[i] = createstring[i] + ');';
 
        
}
 





	try {
                this.internalDB.transaction(function(transaction){ 
                
                for (var j=0; j<createstring.length;j++) {
                transaction.executeSql(createstring[j], [], null, null);  
                }
                
                });
        } 
        catch (e) {
            this.handle(e);
            return;
        }

callback();



}

TDatabase.prototype.insert =function(keylist,varlist,callback){

var context=this;
//  tx.executeSql('INSERT INTO LOGS (id, log) VALUES (2, "logmsg")');

if (keylist.length!=varlist.length) {
this.handle('contagem inconsistente de campos e valores');
return 0;
}
var keys = keylist.join();
var vars = varlist.join('\',\'');
  
var querystring = 'INSERT INTO '+this.currentTable+' ('+keys+') VALUES (\''+vars+'\');';
 



	  try {
                this.internalDB.transaction(function(transaction){ 
                
                	transaction.executeSql(querystring, [], function (tx, results) {

 						
					
					context.resultSet = [];
      					var len = results.rows.length;
	
      					for (var i = 0; i < len; i++){
         				context.resultSet[i] = results.rows.item(i);
     					} 
     					callback();	
   								}, null);  
                
                });
                
        } catch (e) {
            this.handle(e);
            return;
        }


}






TDatabase.prototype.find=function(key, value, list, callback) {
var context=this;
var querystring='';

	if (list==null) {
		 querystring='SELECT * FROM ' + this.currentTable+' WHERE '+key+'='+value+';';
	} else {
		 querystring='SELECT ('+ list +') FROM ' + this.currentTable+' WHERE '+key+'='+value+';';	
	}

 
	
	try {
                this.internalDB.transaction(function(transaction){ 
                
                	transaction.executeSql(querystring, [], function (tx, results) {


      					context.resultSet = [];
      					var len = results.rows.length;
	
      					for (var i = 0; i < len; i++){
         				context.resultSet[i] = results.rows.item(i);
     					} 
						if (callback==null) {
						} else callback();
						
						
   								}, null);  
                
                });
                
        } catch (e) {
            this.handle(e);
            return;
        }	
	
	
	

}

TDatabase.prototype.update = function(key, value, fields, values, callback){
var context=this;


if (fields.length!=values.length) {
this.handle('contagem inconsistente de campos e valores');
return 0;
}

var complexstring="UPDATE "+this.currentTable+" SET "+fields[0]+"='"+values[0]+"'";

for (var i=1; i<fields.length; i++){
complexstring=complexstring+", "+fields[i]+"='"+values[i]+"'";
}

complexstring=complexstring+' WHERE '+key+'='+value+';';
var querystring = complexstring;
 

	try {
                this.internalDB.transaction(function(transaction){ 
 
                	transaction.executeSql(querystring, [], function (tx) {
 

						if (callback===null) {
						} else callback();
						
						
   								}, null);  
                
                });
                
        } catch (e) {
            this.handle(e);
            return;
        }	




}




TDatabase.prototype.remove =function(key, value, callback){
var context=this;
var querystring='DELETE FROM '+this.currentTable+' WHERE '+key+'='+value+';';




	try {
                this.internalDB.transaction(function(transaction){ 
                
                	transaction.executeSql(querystring, [], function (tx, results) {


      					context.resultSet = [];
      					var len = results.rows.length;
	
      					for (var i = 0; i < len; i++){
         				context.resultSet[i] = results.rows.item(i);
     					} 
						if (callback===null) {
						} else callback();
						
						
   								}, null);  
                
                });
                
        } catch (e) {
            this.handle(e);
            return;
        }	
        
        
        
}


var Database= new TDatabase();



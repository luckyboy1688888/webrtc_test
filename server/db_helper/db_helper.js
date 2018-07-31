var pgPromise 			= require("pg-promise")();

module.exports = function() {

    var db;
    var connectionData = {
	    host: 'localhost',
	    port: 5433,
	    database: 'pgdb',
	    user: 'luckyboy',
	    password: '168168'
	};
    this.initDB = function(){
		// db=pgPromise('postgres://luckyboy:168168@localhost:5433/pgdb');
		db=pgPromise(connectionData);
		var sqlInitFile = sql('./server/db_helper/sql_init.sql');
		db.any(sqlInitFile).then(()=> {
	        console.log('pg init finish');
	    }).catch(error=> {
	        console.log(error);
	    });
    };

	/////////return promise
    this.queryData = function(sqlSTR){
    	var result;
    	console.log('query start:'+sqlSTR);
    	return db.any(sqlSTR);
    };


	function sql(file) {
	    // consider using here: path.join(__dirname, file) 
	    return new pgPromise.QueryFile(file, {minify: true});
	};

    
};



/////// by Jecs
    // var f1 = function() {
    // 	var defferef:
    // 	resolve.()
    // 	return 
    // };

    // Q.when(f1)
    // .then(f2)
    // .then(f3)
    // .then(function function_name (err, ) {
    // 	// body...
    // })
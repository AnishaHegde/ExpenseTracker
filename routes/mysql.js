var ejs= require('ejs');
var mysql = require('mysql');

function getPool(){
var pool = mysql.createPool({
	  connectionLimit : 1000,
	  host            : 'localhost',
	  user            : 'root',
	  password        : '',
	  database		  :	'expensetrackerdb',
	  port			  :  3306
	});

	return pool;
}

function fetchData(callback, sqlQuery){

	console.log("\nSQL Query::" + sqlQuery);
	var pool = getPool();

	pool.getConnection(function(err, connection) {

		if(err){
			console.log("ERROR: " + err.message);
		}
		else{
			// Use the connection
			connection.query( sqlQuery, function(err, rows, fields) {

				if(err){
					console.log("ERROR: " + err.message);
				}
				else
				{	// return err or result
					console.log("Database Results: " + rows);
					callback(err, rows);
				}

				console.log("\nConnection released..");
				// finish with the connection.
				connection.release();
				// the connection has been returned to the pool.
			});
		}//end else
	});

}

exports.fetchData = fetchData;
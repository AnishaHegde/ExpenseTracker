

this.db = window.openDatabase('myDb', '1.0', 'User DB', 5*1024*1024);
if (this.db) {
    this.db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS Users (email, password, mobile)',
            [],
            function(tx, rs) { },
            function(tx, err) { alert("Error in create table occurred: " + err) }
        );
    });
}

$(function(){
	
	// Register User
	$('#register').click(function(e){    	    	
	    e.preventDefault();
	    console.log('register button clicked');
	    
	    var email = $('#email').val();
	    var pwd = $('#pwd').val();
	    var mobile = $('#mobile').val();
	    
	    db.transaction(function(tx){
	    	tx.executeSql('INSERT INTO Users (email, password, mobile) VALUES("' + email + '","' + pwd + '","' + mobile + '")');
	    });
		window.location.replace("http://localhost:3000/login");       
	});
	
	// Login User
	$('#login').click(function(e){    	    	
	    e.preventDefault();
	    console.log('login button clicked');
	    
	    var email = $('#email').val();
	    var pwd = $('#pwd').val();
	    console.log("Email: " + email + " " + "Password: " + pwd);

	    db.transaction(function (tx) {
	 	   tx.executeSql('SELECT * FROM Users WHERE email="' + email + '" AND password="' + pwd + '"', [], function (tx, results) {
	 		  console.log("inside select from table"); 
	 	      
	 		  var len = results.rows.length;    	      
	 	      
	 		  if(len == 0){
	 			 alert("Please enter valid credentials!");
	 		  }
	 		  else{
	 			  if(results.rows.item(0).email == email && results.rows.item(0).password == pwd)
	 				 window.location.replace("http://localhost:3000/statistics"); 
	 			  else
	 				 alert("Please enter valid credentials!");  
	 		  }    	         	          	      
	 	   }, null);
	 	});      
	});
});
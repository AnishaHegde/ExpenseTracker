var mysql = require("./mysql");

/* User Login*/
exports.login = function (req, res) {
    var email = req.param("email");
    var password = req.param("password");
    var uType = req.param("uType");

    var query = "SELECT email, type FROM users WHERE email='" + email + "'AND password='" + password + "'AND type='" + uType + "'";
    mysql.fetchData(function (err, results) {
        if (err) {
            console.log("error in login");
            throw err;
        }
        else {
            if (!results.length == 0) {
                req.session.userEmail = results[0].email;
                req.session.isAdmin = false;

                if (results[0].type == "admin") {
                    req.session.isAdmin = true;
                }
                console.log("userEmail: " + req.session.userEmail + ", isAdmin: " + req.session.isAdmin);
                res.send({"statusCode" : 200});
            } else {
                res.send({"statusCode" : 401});
            }
        }
    }, query);
}

/* User register */
exports.register = function (req, res) {
    var email = req.param("email");
    var password = req.param("password");
    var query = "INSERT INTO users (`email`,`password`,`type`) " +
        				  "VALUES ('" + email + "','" + password + "','regularUser');";
    mysql.fetchData(function (err, results) {
        if (err) {
            console.log("error in sign up");
            throw err;
        }
        else {
            res.send({"statusCode" : 200});
        }
    }, query);

}

/* Create Expense */
exports.create = function (req, res) {
    var amount = req.param("amount");
    var description = req.param("description");
    var date = req.param("date");

    var query = "INSERT INTO expenses (`userEmail`,`amount`,`date`, `description`) " +
        "VALUES ('" + req.session.userEmail + "','" + amount + "','" + date + "','" + description + "');";

    mysql.fetchData(function (err, results) {
        if (err) {
            console.log("error");
            res.send({"statusCode" : 401});
            throw err;
        }
        else {
            res.send({"statusCode" : 200});
        }
    }, query);
}

/* Retrieve Expenses */
exports.retrieve = function (req, res) {
    var query = "";

    if (req.session.isAdmin) {
        query = "SELECT * FROM expenses";
    }
    else {
        query = "SELECT * FROM expenses WHERE userEmail='" + req.session.userEmail + "'";
    }
    mysql.fetchData(function (err, results) {
        if (err) {
            console.log("retrieve data from expenses");
            throw err;
        }
        else {
            for (var i = 0; i < results.length; i++) {
                if (results[i].userEmail == req.session.userEmail) {
                    results[i].isOwn = true;
                } else {
                    results[i].isOwn = false;
                }
            }
            res.send(results);
        }
    }, query);
}

/* Update Expense */
exports.update = function (req, res) {
    var id = req.param("id");
    var amount = req.param("amount");
    var description = req.param("description");
    var date = req.param("date");

    var query = "UPDATE expenses SET description ='" + description + "' ,date='" + date + "',amount='" + amount + "' WHERE id='" + id + "'";

    mysql.fetchData(function (err, results) {
        if (err) {
            console.log("error");
            res.send({"statusCode" : 401});
            throw err;
        }
        else {
            res.send({"statusCode" : 200});
        }
    }, query);
}

/* Delete Expense */
exports.delete = function (req, res) {
    var id = req.param("id");

    var query = "DELETE FROM expenses WHERE id ='" + id + "'";
    mysql.fetchData(function (err, results) {
        if (err) {
            console.log("error deleting expense");
            throw err;
        }
        else {
            res.send({"statusCode" : 200});
        }
    }, query);
}

/* View Expenses - Report*/
exports.view = function (req, res) {
    var start_date = req.param("start_date");
    var end_date = req.param("end_date");
    var query = "SELECT * FROM expenses WHERE userEmail ='" + req.session.userEmail + "'" + "AND date BETWEEN '" + start_date + "'AND'" + end_date + "'";

    mysql.fetchData(function (err, results) {
        if (err) {
            console.log("retrieve data from expenses for report");
            throw err;
        }
        else {
            res.send(results);
        }
    }, query);
}


//Logout the user - invalidate the session
exports.logout = function(req,res){
	req.session.destroy();
	res.redirect('/');
};
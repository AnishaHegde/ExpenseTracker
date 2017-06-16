
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , bodyParser = require('body-parser')
  //Importing the 'client-sessions' module for storing the user details
  , session = require('client-sessions');

var app = express();

//configure the sessions with our application
app.use(session({

	cookieName: 'session',
	secret: 'expenseTrackerKey',
	duration: 30 * 60 * 1000,    //setting the time for active session
	activeDuration: 5 * 60 * 1000,  })); // setting time for the session to be active when the window is open // 5 minutes set currently

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/login', user.login);
app.post('/register', user.register);
app.get('/logout', user.logout);

// CRUD operations
app.post('/create', user.create);
app.get('/retrieve', user.retrieve);
app.post('/update', user.update);
app.delete('/delete/:id', user.delete);

// Report
app.post('/viewExpenses', user.view);

// Handle Error
app.use(function(req, res, next) {
	res.render('error');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

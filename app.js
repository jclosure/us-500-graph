
/**
 * Setup Environment
*/
// var env = require('env.json');
// var node_env = process.env.NODE_ENV || 'development';



/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');





var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  //set for appropriate environment
  process.env.NEO4J_URL="http://neo4j:admin@localhost:7474"
  app.use(express.errorHandler());
}

app.locals({
    title: 'US-500 Reference App'    // default title
});

// Routes

app.get('/', routes.site.index);

// Company Routes
app.get('/companies', routes.companies.list);
app.post('/companies', routes.companies.create);
app.get('/companies/:id', routes.companies.show);
app.post('/companies/:id', routes.companies.edit);
app.del('/companies/:id', routes.companies.del);

app.post('/companies/:id/follow', routes.companies.follow);
app.post('/companies/:id/unfollow', routes.companies.unfollow);

// People Routes
app.get('/people', routes.people.list);
app.post('/people', routes.people.create);
app.get('/people/:id', routes.people.show);
app.post('/people/:id', routes.people.edit);
app.del('/people/:id', routes.people.del);

app.post('/people/:id/follow', routes.people.follow);
app.post('/people/:id/unfollow', routes.people.unfollow);



console.log("Launching: " + app.get('env'));
console.log("NEO4J_URL: " + process.env['NEO4J_URL']);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening at: http://localhost:%d/', app.get('port'));
});

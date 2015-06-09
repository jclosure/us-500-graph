
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

app.get('/users', routes.users.list);
app.post('/users', routes.users.create);
app.get('/users/:id', routes.users.show);
app.post('/users/:id', routes.users.edit);
app.del('/users/:id', routes.users.del);

app.post('/users/:id/follow', routes.users.follow);
app.post('/users/:id/unfollow', routes.users.unfollow);


console.log("Launching: " + app.get('env'));
console.log("NEO4J_URL: " + process.env['NEO4J_URL']);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening at: http://localhost:%d/', app.get('port'));
});

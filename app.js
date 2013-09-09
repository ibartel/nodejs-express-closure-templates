
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var os = require('os');
var soynode = require('soynode');

soynode.setOptions({
	outputDir: os.tmpdir(), 
	uniqueDir: true, 
	allowDynamicRecompile: true, 
	eraseTemporaryFiles: true
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', '.soy');
 
var soyRenderer = function(_path, options, callback) {
    var templatePath = _path.replace(path.normalize(this.root + '/'), '');
    templatePath = templatePath.replace('.soy',path.sep + options['function']);
    templatePath = templatePath.split(path.sep).join('.');
    callback(null, options.soynode.render(templatePath, options));
};
 
app.engine('.soy', soyRenderer);
app.use(function(req, res, next) {
    res.locals.soynode = soynode;
    next();
});

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
app.get('/users', user.list);

soynode.compileTemplates('views', function(err) {
    if (err) throw err;
    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });
});

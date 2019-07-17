var path = require('path'),
    http = require('http'),
    config = require('config'),
    compression = require('compression'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart(),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    multiparty = require('multiparty'),
    expressValidator = require('express-validator'),
    session = require('express-session'),
    flash = require('connect-flash'),
    routes = require('./app/routes/routes'),
    cookieSession = require('cookie-session');



var app = module.exports = express();


if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}
console.log('-----------------DB Connected -------------------', config.get('mongoDBURI'));
mongoose.connect(config.get('mongoDBURI'));



// ExpressJS Configuration
app.set('views', __dirname + '/app/views');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(expressValidator());
app.use(bodyParser.json({limit:'100mb'}));
app.use(cookieParser());
app.use(methodOverride());
app.use(compression());

app.use(cookieSession({
  name: 'session',
  keys: ['d88d8d8d898d89d89d989d889x98x89x89x8989898898a8a8a8a8a8a8a'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


app.use(flash());

app.use(function(req, res, next) {
    if(req.session && req.session.user) {
        req.user = req.session.user;
        req.session.user = req.user;
    }
    next();
});


app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '7d'
}));

app.use('/', routes);



/**
 * Server connection..
 */
var server = http.createServer(app);


server.listen(process.env.PORT || 5000, function() {
	console.log('Express server listening on port: 3000');
});
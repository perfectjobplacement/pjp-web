const path = require('path');
const http = require('http');
const compression = require('compression');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const mongoose = require('mongoose');
const morgan = require('morgan');
const multiparty = require('multiparty');
const expressValidator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');
const routes = require('./app/routes/routes');
const cookieSession = require('cookie-session');

const app = module.exports = express();

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

mongoose.connect("mongodb://localhost/perfect-job-placement");



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
const server = http.createServer(app);
server.listen(process.env.PORT || 3000, function() {
	console.log('Express server listening on port: 3000');
});
const bluebird = require('bluebird');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const util = require('util');

const routers = require('./router');
const setting = require('./setting');
const res = require('./middleware/res');
const auth = require('./middleware/auth');
const logError = require('./helper/logerr');
const responseStatus = require('./error/response-status');

/**
 * promisify mongoose
 */
bluebird.promisifyAll(mongoose);

const app = express();

// allow reverse proxy
app.enable('trust proxy');

// access log
// app.use(logger({path: "/data/logs/promotion.log"}));

// accept json request header
app.use(bodyParser.json());

// accept post request
app.use(bodyParser.urlencoded({ extended: false }));

// validator
app.use(expressValidator());

//  secure Express apps
app.use(helmet());

// middleware
app.use(res);
app.use(auth);

// routers
app.use(routers);

/**
 * error handling
 */
app.use((err, req, res, ignore) => {
	if(typeof err === "string") {
		res.json({ status: responseStatus.SERVICE_EXCEPTION, body: err });
	} else {
		console.log(err);
		res.json({ status: responseStatus.INTERNAL_ERROR, body: '系统异常，请稍后再试' });
		// log error
		logError(req.originalUrl, null, err.message);
	}
});
app.use((req, res, ignore) => {
	res.json({ status: responseStatus.REQUEST_NOT_FOUND, body: '请求未找到' });
});

/**
 * connect mongodb
 */
mongoose.Promise = global.Promise;
mongoose.connect(setting.mongodb, {
	useMongoClient: true
});
mongoose.connection.on('error', () => {
	throw new Error(`unable to connect to database: ${ setting.mongodb }`);
}).once('open', () => {
	app.listen(setting.port);
	util.log(setting.appname + ' runnng port:' + setting.port);
});
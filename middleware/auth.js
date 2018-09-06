const LRU = require('lru-cache');

const cryptos = require('../helper/cryptos');
const app = require('../service/app');

const cache = LRU({
	max: 100, // size
	maxAge: 3600000 // 1hour
});

const whitelist = ['/private'];

const _isInWhitelist = (reqPath) =>{
	let has = false;
	for(let str of whitelist) {
		if(reqPath.startsWith(str)) {
			has = true;
			break;
		}
	}
	return has;
};

/**
 * authorization
 */
module.exports = async(req, res, next) => {
	const reqPath = req.path;
	if(_isInWhitelist(reqPath)) {
		return next();
	}

	try {
		const { appid, secret } = req.query;
		if(!appid) {
			return res.failure('appid_required');
		}
		if(!secret) {
			return res.failure('secret_required');
		}

		//  get from cache
		const cacheSecret = cache.get(appid);
		if(cacheSecret) {
			if(cacheSecret !== secret) {
				return res.failure('auth_failed');
			}
			next();
		} else {
			// find app
			const obj = await app.findById(appid);
			if(!obj) {
				return res.failure('appid_not_found');
			}
			if(obj.secret !== secret) {
				return res.failure('auth_failed');
			}
			// set lru cache
			cache.set(appid, obj.secret);
			next();
		}
	} catch(err) {
		next(err);
	}
};
'use strict';
module.exports = {

	clientIP(req) { 
		const ip = req.headers['x-forwarded-for'] || 
		req.connection.remoteAddress || 
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;
		return ip;
	},

	getParameter(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
			return unescape(r[2]); 
		} else {
			return '';
		}
	},

	number(str) {
		if(str.startWith('0')) {
			return str.substring(1)*1;
		} else {
			return str*1;
		}
	},

	/***
	 * promise-sequence
	 * Promise 串行
	 */
	sequence(tasks) {
		function recordValue(results, value) {
			results.push(value);
			return results;
		}
		const pushValue = recordValue.bind(null, []);
		return tasks.reduce((promise, task) => {
			return promise.then(task).then(pushValue);
		}, Promise.resolve());
	}
};
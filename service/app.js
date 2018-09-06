const I = require('./index');
const AppModel = require('../model/app');
const App = new AppModel();

module.exports = Object.assign({}, I._(App), {

	async create(data) {
		const obj = await App.findOne({ name: data.name });
		if(obj) {
			throw '已经存在相同名称的app';
		}
		data.created_at = Date.now();
		return await App.save(data);
	}
});
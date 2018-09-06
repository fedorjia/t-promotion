const Model = require('./index');

class M extends Model {

	constructor() {
		super(require('./schema/category'));
	}
}

module.exports = M;

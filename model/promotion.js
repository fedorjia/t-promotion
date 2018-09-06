const Model = require('./index');

class M extends Model {

	constructor() {
		super(require('./schema/promotion'));
	}
}

module.exports = M;

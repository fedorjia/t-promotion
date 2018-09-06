const Model = require('./index');

class M extends Model {

	constructor() {
		super(require('./schema/app'));
	}
}

module.exports = M;

const Model = require('./index');

class M extends Model {

	constructor() {
		super(require('./schema/coupon-history'));
	}
}

module.exports = M;

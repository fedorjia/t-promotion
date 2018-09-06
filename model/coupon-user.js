const mongoose = require('mongoose');

const Model = require('./index');

class M extends Model {

	constructor() {
		super(require('./schema/coupon-user'));
	}

	// sum(promotion) {
	// 	return this._m().aggregate([
	// 		{
	// 			$match : {
	// 				promotion: mongoose.Types.ObjectId(promotion)
	// 			}
	// 		}, {
	// 			$group : {
	// 				_id : null, count : {$sum : "$count"}
	// 			}
	// 		}
	// 	]);
	// }
}

module.exports = M;

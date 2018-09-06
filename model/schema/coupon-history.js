const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const S = new Schema({
	app: { type: Schema.Types.ObjectId, ref: 'app', required: true },
	coupon : { type: Schema.Types.ObjectId, ref: 'coupon', required: true },
	created_at: { type: Number, default: Date.now() }
});

module.exports = mongoose.model('coupon_history', S);

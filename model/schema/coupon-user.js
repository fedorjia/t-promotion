const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const S = new Schema({
	app: { type: Schema.Types.ObjectId, ref: 'app', required: true },
	promotion : { type: Schema.Types.ObjectId, ref: 'promotion', required: true },
	user : { type: String, required: true }, // 用户
	start_at: { type: Number, required: true }, // 开始时间
	end_at: { type: Number, required: true }, // 结束时间
	is_used: {type: Boolean, default: false}, // 是否已使用
	created_at: { type: Number, default: Date.now() },
	updated_at: { type: Number, default: Date.now() }
});

module.exports = mongoose.model('coupon_user', S);

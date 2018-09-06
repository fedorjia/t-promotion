const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const S = new Schema({
	app : { type: Schema.Types.ObjectId, ref: 'app', required: true },
	merchant : { type: String, required: true }, // 商户
	category : { type: Schema.Types.ObjectId, ref: 'category', required: true }, // 促销分类
	start_at: { type: Number, required: true }, // 开始时间
	end_at: { type: Number, required: true }, // 结束时间
	config: { type: Schema.Types.Mixed }, // 配置信息
	created_at: { type: Number, default: Date.now() }
});

module.exports = mongoose.model('promotion', S);

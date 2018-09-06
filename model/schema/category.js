const mongoose = require('mongoose');

/***
 * 促销分类
 */
const Schema = mongoose.Schema;
const S = new Schema({
	name: { type: String, required: true, unique: true },
	code: { type: String, required: true, unique: true },
	priority: { type: Number, default: 0 }, // 排序号，序号越小优先级越高
	multi: { type: Boolean, default: true }, // 其分类下的促销活动是否能被添加多次
	created_at: { type: Number, default: Date.now() }
});

module.exports = mongoose.model('category', S);

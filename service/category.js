const I = require('./index');
const CategoryModel = require('../model/category');
const PromotionModel = require('../model/promotion');
const Category = new CategoryModel();
const Promotion = new PromotionModel();

module.exports = Object.assign({}, I._(Category), {

	async create(data) {
		const obj = await Category.findOne({code: data.code});
		if(obj) {
			throw '已经存在相同的促销code';
		}
		data.created_at = Date.now();
		return await Category.save(data);
	},

	async get(q) {
		return await Category._m().find(q)
			.sort({priority: 1})
			.execAsync();
	},

	async getByCode(code) {
		return await Category._m().findOne({ code });
	},

	async remove(id) {
		const obj = await Category._m().findByIdAndRemove(id);
		if(!obj) {
			throw '促销分类未找到';
		}
		// 删除关联的促销活动
		return await Promotion.remove({
			category: obj._id
		});
	}
});
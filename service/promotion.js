const I = require('./index');
const PromotionModel = require('../model/promotion');
const CategoryModel = require('../model/category');
const Promotion = new PromotionModel();
const Category = new CategoryModel();

module.exports = Object.assign({}, I._(Promotion), {

	async add(data) {
		data.created_at = Date.now();
		let category;
		// 获取分类信息
		const obj = await Category.findOne({code: data.category});
		if(!obj) {
			throw '促销分类未找到';
		}
		category = obj;
		data.category = category._id;
		// 获取正在运行的促销活动
		const array = await this.getRunnings({
			app: data.app,
			merchant: data.merchant,
			category: data.category
		});

		if(!category.multi) {
			if(array.length > 0) {
				throw '该分类下不允许多次添加促销';
			}
		}
		return await this.save(data);
	},

	/**
	 * 促销活动列表
	 */
	async get(q, skipid, limit) {
		if(skipid) {
			q._id = {'$lt': skipid};
		}
		return await Promotion._m().find(q)
			.limit(limit)
			.sort({created_at: -1})
			.execAsync();
	},

	/**
	 * 删除促销活动
	 */
	async remove(id, appid, merchant) {
		const obj = await Promotion.findById(id);
		if(!obj) {
			throw '促销活动未找到';
		}

		if(obj.merchant.toString() !== merchant
			|| obj.app.toString() !== appid) {
			throw '促销活动信息验证失败';
		}

		return await Promotion.findByIdAndUpdate(id, {
			$set: {
				end_at: Date.now()
			}
		});
	},

	/**
	 *  运行中的促销活动
	 */
	async getRunnings(q) {
		const now = Date.now();
		return await Promotion._m().find(q)
			.where('start_at').lt(now)
			.where('end_at').gt(now)
			.populate('category', '_id name code priority')
			.execAsync();
	}
});
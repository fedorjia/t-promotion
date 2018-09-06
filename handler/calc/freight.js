/**
 * 满免运费
 */
const { CATEGORY_FREIGHT } = require('../../helper/category-config');
const PromotionModel = require('../../model/promotion');
const CategoryModel = require('../../model/category');
const Promotion = new PromotionModel();
const Category = new CategoryModel();

module.exports = {
	/**
	 * 满免运费
	 * @param appid 应用ID
	 * @param merchant 商户
	 * @param amount 总金额
	 */
	async exec(appid, merchant, amount) {
		if(amount <= 0) {
			return null;
		}

		const now = Date.now();
		// 查询促销分类
		const category = await Category.findOne({code: CATEGORY_FREIGHT});

		if (!category) {
			throw '促销分类未找到: ' + CATEGORY_FREIGHT;
		}

		// 促销分类下的有效的促销活动
		const promotion = await Promotion._m().findOne({
			app: appid,
			merchant: merchant,
			category: category._id
		}).where('start_at').lt(now).where('end_at').gt(now);

		if(!promotion) {
			return null;
		}

		const { base } = promotion.config;
		let value = promotion.config.value;

		return {
			name: category.name,
			code: category.code,
			description: `满${base}元免运费`,
			value: amount >= base? 0: value // 金额大于运费阀值，免运费
		};
	}
};
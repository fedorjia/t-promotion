/**
 * 代金券核销
 */
const { CATEGORY_DIRECT_COUPON } = require('../../helper/category-config');
const couponService = require('../../service/coupon-user');
const categoryService = require('../../service/category');

module.exports = {
	async exec(appid, user, merchant, couponid) {
		const obj = await couponService.getById(couponid);

		if (!obj) {
			throw CATEGORY_DIRECT_COUPON + ': 优惠券未找到';
		}
		if (user !== obj.user) {
			throw CATEGORY_DIRECT_COUPON + ': 用户并未拥有此优惠券';
		}
		if (!obj.app || appid !== obj.app.toString()) {
			throw CATEGORY_DIRECT_COUPON + ': appid不匹配';
		}
		if(!obj.promotion) {
			throw CATEGORY_DIRECT_COUPON + ': 促销活动未找到';
		}
		if(obj.promotion.merchant !== merchant) {
			throw CATEGORY_DIRECT_COUPON + ': 促销活动商户不匹配';
		}

		const category = await categoryService.getByCode(CATEGORY_DIRECT_COUPON);
		if(!category) {
			throw CATEGORY_DIRECT_COUPON + ': 分类未找到';
		}

		await couponService.use(appid, couponid);

		const {value} = obj.promotion.config;

		return {
			code: CATEGORY_DIRECT_COUPON,
			name: category.name,
			description: `直减${value}`,
			objectid: couponid,
			discount: obj.promotion.config.value
		}
	}
};
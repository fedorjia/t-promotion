/**
 * 优惠券核销
 */
const { CATEGORY_EXPIRE_COUPON } = require('../../helper/category-config');
const couponService = require('../../service/coupon-user');
const categoryService = require('../../service/category');

module.exports = {
	async exec(appid, user, merchant, couponid) {
		let obj = await couponService.getById(couponid);

		if (!obj) {
			throw CATEGORY_EXPIRE_COUPON + ': 优惠券未找到';
		}
		if (user !== obj.user) {
			throw CATEGORY_EXPIRE_COUPON + ': 用户并未拥有此优惠券';
		}
		if (!obj.app || appid !== obj.app.toString()) {
			throw CATEGORY_EXPIRE_COUPON + ': appid不匹配';
		}
		if(!obj.promotion) {
			throw CATEGORY_EXPIRE_COUPON + ': 促销活动未找到';
		}
		if(obj.promotion.merchant !== merchant) {
			throw CATEGORY_EXPIRE_COUPON + ': 促销活动商户不匹配';
		}

		const category = await categoryService.getByCode(CATEGORY_EXPIRE_COUPON);
		if(!category) {
			throw CATEGORY_EXPIRE_COUPON + ': 分类未找到';
		}

		await couponService.use(appid, couponid);

		return {
			name: category.name,
			code: CATEGORY_EXPIRE_COUPON,
			description: `优惠券可抵用${obj.promotion.config.value}元`,
			objectid: couponid,
			discount: obj.promotion.config.value
		}
	}
};
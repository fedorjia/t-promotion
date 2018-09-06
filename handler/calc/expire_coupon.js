/**
 * 满减优惠券
 */
const { CATEGORY_EXPIRE_COUPON } = require('../../helper/category-config');
const PromotionModel = require('../../model/promotion');
const CouponModel = require('../../model/coupon-user');
const CategoryModel = require('../../model/category');
const Coupon = new CouponModel();
const Promotion = new PromotionModel();
const Category = new CategoryModel();

module.exports = {
	/***
	 * 优惠券促销处理
	 * @param appid 应用ID
	 * @param merchant 商户
	 * @param amount 总金额
	 * @param user 用户
	 * @param selectedPromotion 所选促销
	 */
	// 自动选择最优
	async exec(appid, merchant, amount, user, selectedPromotion) {
		if(amount <= 0) {
			return null;
		}
		const now = Date.now();
		// 查询促销分类
		const category = await Category.findOne({code: CATEGORY_EXPIRE_COUPON});
		if(!category) {
			throw '促销分类未找到: ' + CATEGORY_EXPIRE_COUPON;
		}
		const array = await Promotion._m().find({
			app: appid,
			merchant: merchant,
			category: category._id
		}).where('start_at').lt(now).where('end_at').gt(now);

		const promotionids = array.map((item) => item._id);
		if(promotionids.length === 0) {
			return null;
		}

		// 查询用户有效的优惠券
		let coupons = await Coupon._m().find({
			user: user,
			is_used: false,
			promotion: { '$in': promotionids }
		}).populate('promotion', '_id config').execAsync();

		if(coupons.length === 0) {
			return null;
		}

		// 按照优惠券价格排序
		coupons = coupons.sort((a, b) => {
			return b.promotion.config.base - a.promotion.config.base;
		});

		let coupon;
		if(selectedPromotion) {
			coupon = coupons.find((item) => item._id.toString() === selectedPromotion.objectid);
		} else {
			// 从中选择一张优惠券
			for(let tmp of coupons) {
				if(amount >= tmp.promotion.config.base) {
					coupon = tmp;
					break;
				}
			}
		}

		if(!coupon) {
			return null;
		}

		const {base, value} = coupon.promotion.config;
		const ratio = Math.floor(amount / base);
		const discount = ratio * value;
		return {
			name: category.name,
			code: category.code,
			description: `满${base}减${value}`,
			discount: discount,
			objectid: coupon._id
		};
	}
};
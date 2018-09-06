
const I = require('./index');
const CouponModel = require('../model/coupon-user');
const PromotionModel = require('../model/promotion');
const CouponHistorynModel = require('../model/coupon-history');
const Coupon = new CouponModel();
const Promotion = new PromotionModel();
const CouponHistory = new CouponHistorynModel();

module.exports = Object.assign({}, I._(Coupon), {
	/**
	 * 领取优惠券
	 */
	async save(data) {
		const now = Date.now();
		data.created_at = now;
		data.updated_at = now;

		const promotion = await Promotion.findById(data.promotion);

		if(!promotion) {
			throw '未找到促销活动';
		}
		let config = promotion.config;
		if(!config) {
			throw '促销活动配置未定义';
		}
		if(!config.count) {
			throw '促销活动配置数量未定义';
		}

		const gotCount = await Coupon.count({promotion: data.promotion});

		const totalCount = promotion.config.count;
		// console.log(totalCount, gotCount);
		if(totalCount - gotCount < 1) {
			throw '剩余优惠券数量不足';
		}
		// 查询用户在此促销活动下的优惠券
		const array = await Coupon.find({user: data.user, promotion: data.promotion});

		// 判断用户是否已经存在未使用的优惠券
		let isValid = true;
		for(let item of array) {
			if(!item.is_used) {
				isValid = false;
				break;
			}
		}
		if(!isValid) {
			throw '您已经领取过了';
		}
		// 添加用户优惠券
		data.start_at = promotion.start_at;
		data.end_at = promotion.end_at;
		return await Coupon.save(data);
	},

	async getById(id) {
		return await Coupon._m().findById(id)
			.populate('promotion', '_id name category merchant start_at end_at config')
			.execAsync();
	},

	/**
	 * 列表
	 */
	async get(q, skipid, limit) {
		if(skipid && skipid !== '0' && skipid !== 'null') {
			q._id = {'$lt': skipid};
		}
		const array = await Coupon._m().find(q)
			.populate({
				path: 'promotion',
				model: 'promotion',
				populate: {
					path: 'category',
					model: 'category',
				}
			})
			.limit(limit)
			.sort({created_at: -1})
			.execAsync();

		let result = [];
		for(let item of array) {
			let coupon = item.promotion.toObject();
			coupon.is_used = item.is_used;
			coupon.created_at = item.created_at;
			coupon.value = item.promotion.config.value;
			coupon.category = item.promotion.category.code;
			const code = item.promotion.category.code;
			switch (code) {
				case 'direct_coupon':
					coupon.description = `直减¥${item.promotion.config.value}`;
					break;
				case 'expire_coupon':
					coupon.description = `满¥${item.promotion.config.base}可用`;
					break;
			}
			coupon.config = null;
			result.push(coupon);
		}
		return result;
	},

	/**
	 * 使用优惠券
	 */
	async use(appid, couponid) {
		const now = Date.now();
		const obj = await Coupon.findById(couponid);
		if(!obj) {
			throw '优惠券未找到';
		}
		if (!obj.app || appid !== obj.app.toString()) {
			throw 'appid不匹配';
		}
		if(now > obj.end_at) {
			throw '优惠券已过期';
		}
		if(obj.is_used) {
			throw '优惠券已使用';
		}

		// 使用优惠券
		await Coupon.findByIdAndUpdate(couponid, {
			'$set': {
				is_used: true,
				updated_at: now
			}
		});

		// 生成记录
		await CouponHistory.save({
			app: appid,
			coupon: couponid,
			created_at: now
		});
		return true;
	}
});
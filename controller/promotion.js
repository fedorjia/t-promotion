const express = require('express');
const mongoose = require('mongoose');
const router = express.Router({mergeParams: true});
const { query, body, validationResult } = require('express-validator/check');

const ValidateError = require('../error/validate-error');
const promotionService = require('../service/promotion');
const { isValidCategory } = require('../helper/category-config');
const cal = require('../handler/calc');
const charge = require('../handler/charge');

/**
 * 验证促销-selects
 */
const _isValidPromotion = (selects) => {
	let is = true;
	if(!Array.isArray(selects)) {
		is = false;
	} else {
		if(selects.len > 0) {
			const promotion = selects[0];
			if(!promotion.code || !promotion.objectid) {
				is = false;
			}
		}
	}
	return is;
};

/** 
* 添加促销
*/
router.post('/', [
	query('appid', 'appid_required').trim().isLength({ min: 1 }),
	body('category', 'category_required').trim().isLength({ min: 1 }),
	body('merchant', 'merchant_required').trim().isLength({ min: 1 }),
	body('start_at', 'start_at_required').trim().isLength({ min: 1 }),
	body('end_at', 'end_at_required').trim().isLength({ min: 1 }),
	body('config', 'config_required').trim().isLength({ min: 1 })
], async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.failure(new ValidateError(errors.array()));
		}

		const config = JSON.parse(req.body.config);
		if(!isValidCategory(req.body.category, config)) {
			return res.failure('配置信息不正确');
		}

		const { appid } = req.query;
		const { merchant, category, start_at, end_at } = req.body;

		const o = await promotionService.add({
			// mongoose.Types.ObjectId(req.body.merchantId),
			app: appid,
			merchant,
			category,
			start_at,
			end_at,
			config
		});
		res.success(o);
	} catch (err) {
		next(err);
	}
});


/** 
* 通过商户查找促销
*/
router.get('/', [
	query('appid', 'appid_required').trim().isLength({ min: 1 }),
	query('merchant', 'merchant_required').trim().isLength({ min: 1 }),
], async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.failure(new ValidateError(errors.array()));
		}

		const { appid, merchant } = req.query;
		const limit = req.query.limit || 20;
		const skipid = req.query.skipid;

		const o = await promotionService.get({
			app: appid, merchant
		}, skipid, Number(limit));
		res.success(o);
	} catch (err) {
		next(err);
	}
});

/** 
* 删除促销
*/
router.delete('/:id', [
	query('appid', 'appid_required').trim().isLength({ min: 1 }),
	query('merchant', 'merchant_required').trim().isLength({ min: 1 }),
], async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.failure(new ValidateError(errors.array()));
		}

		const { appid, merchant } = req.query;
		await promotionService.remove(req.params.id, appid, merchant);
		res.success(true);
	} catch (err) {
		next(err);
	}
});

/**
 * 计算促销价格
 * @param appid 应用ID
 * @param user 用户ID
 * @param merchant: (商户ID，required, string)
 * @param amount: (金额, required, decimal)
 * @param selects: (所选促销, optional, array)
 * 			code: (促销分类code, string)
 * 			objectid: (所使用的促销如优惠券、代金券等, string)
 */
router.post('/cal', [
	query('appid', 'appid_required').trim().isLength({ min: 1 }),
	body('user', 'user_required').trim().isLength({ min: 1 }),
	body('merchant', 'merchant_required').trim().isLength({ min: 1 }),
	body('amount', 'amount_required').trim().isLength({ min: 1 }),
], async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.failure(new ValidateError(errors.array()));
		}

		const { appid } = req.query;
		const { user, merchant, amount } = req.body;

		const selects = JSON.parse(req.body.selects || '[]');
		if(!_isValidPromotion(selects)) {
			return res.failure('invalid_selects');
		}
		const o = await cal.exec(appid, user, merchant, amount, selects);
		res.success(o);
	} catch (err) {
		next(err);
	}
});


/**
 * 核销促销活动
 * @param user 用户ID (requried, string)
 * @param chargeId 第三方订单号 (requried, string)
 * @param merchant: 商户ID (required, string)
 * @param selects: 所选促销活动 (required, array)
 * 				code: 促销分类code (required, string)
 * 				objectid: 所使用的促销，如优惠券、代金券等 (required, string)
 */
router.post('/charge', [
	query('appid', 'appid_required').trim().isLength({ min: 1 }),
	body('user', 'user_required').trim().isLength({ min: 1 }),
	body('merchant', 'merchant_required').trim().isLength({ min: 1 }),
	body('selects', 'selects_required').trim().isLength({ min: 1 })
], async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.failure(new ValidateError(errors.array()));
		}

		const { appid } = req.query;
		let { user, merchant, tradeid, selects = '[]' } = req.body;

		selects = JSON.parse(selects);
		if(!_isValidPromotion(selects) || selects.length === 0) {
			return res.failure('invalid_selects');
		}
		// charge off promotion
		const o = await charge.exec(appid, user, merchant, selects, tradeid);
		res.success(o);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
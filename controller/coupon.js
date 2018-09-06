'use strict';
const express = require('express');
const router = express.Router({mergeParams: true});
const { query, body, validationResult } = require('express-validator/check');

const ValidateError = require('../error/validate-error');
const Coupon = require('../service/coupon-user');

/**
 * 领取优惠券
 */
router.post('/', [
	query('appid', 'appid_required').trim().isLength({ min: 1 }),
	body('promotion', 'promotion_required').trim().isLength({ min: 1 }),
	body('user', 'user_required').trim().isLength({ min: 1 })
], async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.failure(new ValidateError(errors.array()));
		}

		const { appid } = req.query;
		const { promotion, user } = req.body;

		const o = await Coupon.save({
			app: appid,
			promotion,
			user
		});
		res.success(o);
	} catch (err) {
		next(err);
	}
});

/**
 * 用户优惠券列表
 */
router.get('/', [
	query('appid', 'appid_required').trim().isLength({ min: 1 }),
	query('user', 'user_required').trim().isLength({ min: 1 })
], async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.failure(new ValidateError(errors.array()));
		}

		const { appid, user } = req.query;
		const limit = req.query.limit || 20;
		const skip = req.query.skip || null;

		const o = await Coupon.get({
			user, app: appid
		}, skip, Number(limit));

		res.success(o);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
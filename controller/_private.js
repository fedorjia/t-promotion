const express = require('express');
const router = express.Router({mergeParams: true});
const { query, body, validationResult } = require('express-validator/check');

const ValidateError = require('../error/validate-error');
const cryptos = require('../helper/cryptos');
const settings = require('../setting');
const app = require('../service/app');
const category = require('../service/category');

const PRIVATE = '57d7a10f044f2d28727d4602';

/**
 * 添加app
 */
router.post('/app', [
	query('token', 'token_required').trim().isLength({ min: 1 }),
	body('name', 'app_name_required').trim().isLength({ min: 1 })
], async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.failure(new ValidateError(errors.array()));
		}

		const { name } = req.body;
		const { token } = req.query;

		if(token !== PRIVATE) {
			return res.failure('invalid_token');
		}

		const o = await app.create({
			name: name,
			secret: cryptos.sha256(cryptos.unique(24), settings.salt)
		});
		res.success(o);
	} catch(err) {
		next(err);
	}
});


/**
 * 添加促销分类
 */
router.post('/category', [
	query('token', 'token_required').trim().isLength({ min: 1 }),
	body('name', 'name_required').trim().isLength({ min: 1 }),
	body('code', 'code_required').trim().isLength({ min: 1 }),
	body('priority', 'priority_required').trim().isLength({ min: 1 }),
	body('multi', 'multi_required').trim().isLength({ min: 1 })
], async(req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.failure(new ValidateError(errors.array()));
		}

		const { token } = req.query;
		const { name, code, priority, multi } = req.body;
		if(token !== PRIVATE) {
			return res.failure('invalid_token');
		}

		const o = await category.create({
			name, code, priority, multi
		});
		res.success(o);
	} catch (err) {
		next(err);
	}
});


/**
 * 删除促销分类
 */
router.delete('/category/:id', async(req, res, next) => {
	try {
		await category.remove(req.params.id);
		res.success(true);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
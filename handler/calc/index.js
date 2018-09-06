/**
 * 促销活动 - 计算
 */
const { CATEGORY_FREIGHT } = require('../../helper/category-config');
const categoryService = require('../../service/category');

const _handle = async function (categories, appid, merchant, totalAmount, user, selects) {
	let items = [];
	let discount = 0;

	// 遍历商户促销分类，计算每种促销分类所产生的折扣
	for(const category of categories) {
		const mAmount = totalAmount - discount;
		if(mAmount > 0) {
			let handler;
			try {
				handler = require(`./${category.code}`);
			} catch (err) {
				throw 'category_code_not_found';
			}

			let item = null;
			let select = null;
			if(selects !== null && selects.length > 0) {
				for(let selected of selects) {
					if(selected.code === category.code) {
						select = selected;
						break;
					}
				}
				if(select) {
					item = await handler.exec(appid, merchant, mAmount, user, select);
				}
			} else {
				item = await handler.exec(appid, merchant, mAmount, user, null);
			}

			if(item) {
				items.push(item);
				if(item.code !== CATEGORY_FREIGHT) {
					discount += item.discount;
				}
			}
		}
	}
	return items;
};

module.exports = {
	/**
	 * 计算促销价格
	 * @param appid 应用ID
	 * @param user 用户ID
	 * @param merchant 商户
	 * @param amount 金额
	 * @param selects 所选促销
	 */
	async exec(appid, user, merchant, amount, selects) {
		let discount = 0;
		// 促销分类
		const categories = await categoryService.get({});
		// 促销计算
		const array = await _handle(categories, appid, merchant, amount, user, selects);

		let freight = null;
		let promotions = [];
		// 遍历商户下的促销
		for (let item of array) {
			if(item.code === CATEGORY_FREIGHT) {
				freight = item;
			} else {
				discount += item.discount;
				promotions.push(item);
			}
		}
		// console.log(discount);
		// console.log(promotions);
		// console.log({discount, freight, promotions});
		return {
			discount,
			freight,
			promotions: promotions
		};
	}
};
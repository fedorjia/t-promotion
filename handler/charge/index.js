/**
 * 促销活动 - 核销
 */
module.exports = {
	/**
	 * 核销促销活动
	 * @param appid 用用ID
	 * @param user 用户
	 * @param merchant 商户
	 * @param selects 所选促销
	 * @param tradeid 第三方订单号
	 */
	async exec(appid, user, merchant, selects, tradeid) {
		let tasks = [];
		for(let item of selects) {
			let handler;
			try {
				handler = require(`./${item.code}`);
			} catch (err) {
				throw 'category_code_not_found';
			}
			tasks.push(await handler.exec(appid, user, merchant, item.objectid, tradeid));
		}
		return await Promise.all(tasks);
	}
};
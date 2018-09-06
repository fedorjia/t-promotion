const CATEGORY_DIRECT_COUPON = 'direct_coupon'; // 直减
const CATEGORY_EXPIRE_COUPON = 'expire_coupon'; // 满减
const CATEGORY_FREIGHT = 'freight'; // 满免运费


exports.CATEGORY_DIRECT_COUPON = CATEGORY_DIRECT_COUPON;
exports.CATEGORY_EXPIRE_COUPON = CATEGORY_EXPIRE_COUPON;
exports.CATEGORY_FREIGHT = CATEGORY_FREIGHT;


exports.isValidCategory = (categoryName, config) => {
	let is = true;
	switch (categoryName) {
		case CATEGORY_DIRECT_COUPON:
			if(!Number.isInteger(config.value) || config.value <= 0
				|| !Number.isInteger(config.count) || config.count <= 0) {
				is = false;
			}
			break;
		case CATEGORY_EXPIRE_COUPON:
			if(!Number.isInteger(config.base) || config.base <= 0
				|| !Number.isInteger(config.value) || config.value <= 0
				|| !Number.isInteger(config.count) || config.count <= 0) {
				is = false;
			}
			break;
		case CATEGORY_FREIGHT:
			if(!Number.isInteger(config.base) || config.base <= 0
				|| !Number.isInteger(config.value) || config.value <= 0) {
				is = false;
			}
			break;
		default:
			is = false;
			break;
	}
	return is;
};
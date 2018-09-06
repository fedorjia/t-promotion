const express = require('express');
const router = express.Router({mergeParams: true});

// ---- private ----
router.use('/private', require('./controller/_private'));

// ---- api ----
router.use('/promotion', require('./controller/promotion'));
router.use('/coupon', require('./controller/coupon'));

module.exports = router;
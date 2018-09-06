const mongoose = require('mongoose');

/***
 * app
 */
const Schema = mongoose.Schema;
const S = new Schema({
	name: { type: String, required: true, unique: true },
	secret: {type: String},
	created_at: { type: Number, default: Date.now() }
});

module.exports = mongoose.model('app', S);

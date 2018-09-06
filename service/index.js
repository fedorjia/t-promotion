/**
 * generic service
 */
module.exports = {

	_(M) {
		this._m = M;
		return this;
	},

	/**
	 * save
	 */
	async save(data) {
		return await this._m.save(data);
	},

	/***
	 * update
	 */
	async update(q, u, options) {
		return await this._m.update(q, u, options);
	},

	/**
	 * find one and update
	 */
	async findOneAndUpdate(q, u) {
		return await this._m.findOneAndUpdate(q, u);
	},

	/**
	 * find by id and update
	 */
	async findByIdAndUpdate(id, u) {
		return await this._m.findByIdAndUpdate(id, u);
	},

	/**
	 * remove
	 */
	async remove(q) {
		return await this._m.remove(q);
	},

	/**
	 * find one and remove
	 */
	async findOneAndRemove(q) {
		return await this._m.findOneAndRemove(q);
	},

	/**
	 * find by id and remove
	 */
	async findByIdAndRemove(id) {
		return await this._m.findByIdAndRemove(id);
	},

	/***
	 * count
	 */
	async count(q) {
		return await this._m.count(q);
	},


	/***
	 * find
	 */
	async find(query, fields, options) {
		return await this._m.find(query, fields, options);
	},

	/**
	 * find by id
	 */
	async findById(id) {
		return await this._m.findById(id);
	},

	/**
	 * find one
	 */
	async findOne(q) {
		return await this._m.findOne(q);
	},

	/**
	 * inc
	 */
	async inc(q, s) {
		return await this._m.inc(q, s);
	}
};
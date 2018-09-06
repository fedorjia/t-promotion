class Model {

	constructor(model) {
		this.model = model;
	}

	/***
	 * 获取 mongoose model
	 */
	_m() {
		return this.model;
	}

	/**
	 * save
	 */
	save(data) {
		const instance = new this.model(data);
		return instance.saveAsync();
	}

	/***
	 * update
	 */
	update(q, u, options) {
		return this.model.updateAsync(q, u, options);
	}

	/**
	 * find one and update
	 */
	findOneAndUpdate(q, u) {
		return this.model.findOneAndUpdateAsync(q, u);
	}

	/**
	 * find by id and update
	 */
	findByIdAndUpdate(id, u) {
		return this.model.findByIdAndUpdateAsync(id, u);
	}

	/**
	 * remove
	 */
	remove(q) {
		if(Object.keys(q).length === 0) {
			throw new Error('must has query param');
		}
		return this.model.removeAsync(q);
	}

	/**
	 * find one and remove
	 */
	findOneAndRemove(q) {
		return this.model.findOneAndRemoveAsync(q);
	}

	/**
	 * find by id and remove
	 */
	findByIdAndRemove(id) {
		return this.model.findByIdAndRemoveAsync(id);
	}

	/***
	 * count
	 */
	count(q) {
		return this.model.countAsync(q);
	}

	/**
	 * list
	 */
	list(q, skipid, limit, sort) {
		if(skipid) {
			return this.model.find(q)
				.skip({
					_id: {
						'$lt': skipid
					}
				})
				.limit(limit)
				.sort(sort)
				.execAsync();
		} else {
			return this.model.find(q)
				.limit(limit)
				.sort(sort)
				.execAsync();
		}
	}

	/***
	 * find
	 */
	find(query, fields, options) {
		return this.model.findAsync(query, fields, options);
	}

	/**
	 * find by id
	 */
	findById(id) {
		return this.model.findByIdAsync(id);
	}

	/**
	 * find one
	 */
	findOne(q) {
		return this.model.findOneAsync(q);
	}

	/**
	 * inc
	 */
	inc(q, s) {
		return this.model.updateAsync(q, {
			'$inc': s
		});
	}
}

module.exports = Model;

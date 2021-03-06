function Baddie(blockX = 1, blockY = 1) {
	this.sprite = new PIXI.Sprite();
	this.sprite.x = blockX * BLOCK_SIZE;
	this.sprite.y = blockY * BLOCK_SIZE;
	Baddie.container.addChild(this.sprite);
	this.direction = 'down';
	this.action = 'hatching';
	this.frameCount = 0;
	if (stationaryBlocks.blocks.length) {
		stationaryBlocks.blocks[blockY][blockX] = BLOCK_INITIAL_INTEGRITY - 1;
	}
}

Baddie.container = new PIXI.Container();
Baddie.container.position.set(-1, -1);

Baddie.prototype.destroy = function () {
	Baddie.container.removeChild(this.sprite);
}

Baddie.prototype.update = function () {
	this._chooseAction();
	this._doAction();
	this._updateSprite();
};

Baddie.prototype._chooseAction = function () {
	if (this.action === 'getting-pushed' || this.action === 'hatching') {
		// don't have a choice about what to do
		return;
	}

	const { x: spriteX, y: spriteY } = this.sprite;
	const blockX = spriteX % BLOCK_SIZE ? null : spriteX / BLOCK_SIZE;
	const blockY = spriteY % BLOCK_SIZE ? null : spriteY / BLOCK_SIZE;

	// if we're between blocks then carry on doing the current action
	if (blockX === null || blockY === null) {
		return;
	}

	// if we're crushing a block then wait until it has finished
	if (this.action === 'push') {
		const neighbour = Baddie._blockNeighbour(blockX, blockY, this.direction);
		// if block has been crushed then walk forward, otherwise keep pushing
		if (neighbour === 0) {
			this.action = 'walk';
		}
		return;
	}

	// otherwise, make an array of all potential action choices
	const choices = [];
	for (const direction of ['up', 'down', 'left', 'right']) {
		const neighbour = Baddie._blockNeighbour(blockX, blockY, direction);
		if (neighbour !== null) {
			const action = neighbour === 0 ? 'walk' : 'push';
			const probability = this._actionProbability(action, direction);
			Baddie.pushN(choices, { action, direction }, probability);
		}
	}

	// choose a random item from all potential actions
	const choice = chooseRandom(choices);
	this.action = choice.action;
	this.direction = choice.direction;
};

Baddie.pushN = function (array, item, n) {
	for (let i = 0; i < n; ++i) {
		array.push(item);
	}
}

Baddie.prototype._actionProbability = function (action, direction) {
	switch (action) {
		case 'push':
			return 2;
		case 'walk':
			const diff = Baddie._directionDifference(direction, this.direction);
			if (diff === 2) {
				return 1;
			}
			if (diff === 1) {
				return 16;
			}
			return 32;
		default:
			return 0;
	}
}

Baddie._directionDifference = function (direction1, direction2) {
	if (direction1 === direction2) {
		return 0;
	}
	const orientation = { up: 0, down: 0, left: 1, right: 1 };
	if (orientation[direction1] !== orientation[direction2]) {
		return 1;
	}
	return 2;
}

// TODO: Make this a functon of `blocks`
Baddie._blockNeighbour = function (blockX, blockY, direction) {
	let blockXX = blockX;
	let blockYY = blockY;

	switch (direction) {
		case 'up':
			--blockYY;
			break;
		case 'down':
			++blockYY;
			break;
		case 'left':
			blockXX--;
			break;
		case 'right':
			blockXX++;
			break;
	}

	// out of bounds
	if (blockXX < 1 || blockXX >= GRID_SIZE_X - 1 || blockYY < 1 || blockYY >= GRID_SIZE_Y - 1) {
		return null;
	}

	return stationaryBlocks.blocks[blockYY][blockXX];
};

Baddie.prototype._doAction = function () {
	switch (this.action) {
		case 'walk':
			this._walk();
			break;
		case 'push':
			this._push();
			break;
		case 'hatching':
			this._hatch();
			break;
	}
};

Baddie.prototype._updateSprite = function () {
	let textureName;

	switch (this.action) {
		case 'push':
			textureName = `baddie/push-${this.direction}.png`;
			break;
		case 'walk':
			textureName = `baddie/walk-${this.direction}-${(this.sprite.position.x >> 3) % 2 + (this.sprite.position.y >> 3) % 2}.png`;
			break;
		case 'getting-pushed':
			break;
		case 'hatching':
			textureName = `baddie/hatch-${Math.floor(this.frameCount / 5)}.png`;
			break;
	}

	if (textureName) {
		// using global `textures` var
		this.sprite.texture = textures[textureName];
	}
};

Baddie.prototype._walk = function () {
	switch (this.direction) {
		case 'up':
			this.sprite.y -= 1;
			break;
		case 'down':
			this.sprite.y += 1;
			break;
		case 'left':
			this.sprite.x -= 1;
			break;
		case 'right':
			this.sprite.x += 1;
			break;
	}
};

Baddie.prototype._push = function () {
	const { x: spriteX, y: spriteY } = this.sprite;
	const blockX = spriteX % BLOCK_SIZE ? null : spriteX / BLOCK_SIZE;
	const blockY = spriteY % BLOCK_SIZE ? null : spriteY / BLOCK_SIZE;

	let blockXX = blockX;
	let blockYY = blockY;

	switch (this.direction) {
		case 'up':
			--blockYY;
			break;
		case 'down':
			++blockYY;
			break;
		case 'left':
			--blockXX;
			break;
		case 'right':
			++blockXX;
			break;
	}

	const neighbour = stationaryBlocks.blocks[blockYY][blockXX];
	if (neighbour === BLOCK_INITIAL_INTEGRITY) {
		stationaryBlocks.blocks[blockYY][blockXX] = BLOCK_INITIAL_INTEGRITY - 1;
	}
};

Baddie.prototype._hatch = function () {
	if (++this.frameCount === 60) {
		// finished hatching
		this.action = 'none';
	}
}

function Baddie() {
	this.sprite = new PIXI.Sprite();
	this.sprite.x = 16;
	this.sprite.y = 16;
	this.direction = 'down';
	this.action = 'walk';
	Baddie.container.addChild(this.sprite);	
}

Baddie.container = new PIXI.Container();

Baddie.prototype.destroy = function () {
	Baddie.container.removeChild(this.sprite);
}

Baddie.prototype.update = function () {
	this._chooseAction();
	this._doAction();
	this._updateSprite();
};

Baddie.prototype._chooseAction = function () {
	const { x: spriteX, y: spriteY } = this.sprite;
	const blockX = spriteX % BLOCK_SIZE ? null : spriteX / BLOCK_SIZE;
	const blockY = spriteY % BLOCK_SIZE ? null : spriteY / BLOCK_SIZE;

	// if we're between blocks then carry on doing the current action
	if (blockX === null || blockY === null) {
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
			return Baddie._directionDifference(direction, this.direction) === 2 ? 1 : 32;
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
	if (blockXX < 1 || blockXX >= GAME_SIZE_X - 1 || blockYY < 1 || blockYY >= GAME_SIZE_Y - 1) {
		return null;
	}

	return stationaryBlocks.blocks[blockYY][blockXX];
};

Baddie.prototype._doAction = function () {
	switch (this.action) {
		case 'walk':
			this._walk();
			break;
	}
};

Baddie.prototype._updateSprite = function () {
	let textureName;
	// if (this.action === 'push') {
	// 	textureName = `baddie/push-${this.direction}.png`;
	// }
	// else {
		textureName = `baddie/walk-${this.direction}-${(this.sprite.position.x >> 3) % 2 + (this.sprite.position.y >> 3) % 2}.png`;
	// }
	// using global `textures` var
	this.sprite.texture = textures[textureName];
};

Baddie.prototype._canTurnHorizontal = function () {
	return this.sprite.position.y % 16 === 0;
};

Baddie.prototype._canTurnVertical = function () {
	return this.sprite.position.x % 16 === 0;
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

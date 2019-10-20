const penguin = {
	textures: {},
	initTextures: function(textures) {
		this.textures = {
			'push-down-0': textures['penguin/push-down-0.png'],
			'push-down-1': textures['penguin/push-down-1.png'],
			'push-left-0': textures['penguin/push-left-0.png'],
			'push-left-1': textures['penguin/push-left-1.png'],
			'push-right-0': textures['penguin/push-right-0.png'],
			'push-right-1': textures['penguin/push-right-1.png'],
			'push-up-0': textures['penguin/push-up-0.png'],
			'push-up-1': textures['penguin/push-up-1.png'],
			'walk-up-0': textures['penguin/walk-up-0.png'],
			'walk-up-1': textures['penguin/walk-up-1.png'],
			'walk-down-0': textures['penguin/walk-down-0.png'],
			'walk-down-1': textures['penguin/walk-down-1.png'],
			'walk-left-0': textures['penguin/walk-left-1.png'],
			'walk-left-1': textures['penguin/walk-left-0.png'],
			'walk-right-0': textures['penguin/walk-right-1.png'],
			'walk-right-1': textures['penguin/walk-right-0.png'],
		};
	},
	sprite: new PIXI.Sprite(),
	facing: 'down',
	moving: 'none',
	update: function() {
		const isOnBlock = this._canTurnHorizontal() && this._canTurnVertical();

		if (pressedKeys.has('ArrowUp') && this._canTurn('up')) {
			this.facing = this.moving = 'up';
		}
		else if (pressedKeys.has('ArrowDown') && this._canTurn('down')) {
			this.facing = this.moving = 'down';
		}
		else if (pressedKeys.has('ArrowLeft') && this._canTurn('left')) {
			this.facing = this.moving = 'left';
		}
		else if (pressedKeys.has('ArrowRight') && this._canTurn('right')) {
			this.facing = this.moving = 'right';
		}
		else if (isOnBlock) {
			this.moving = 'none';
		}

		let textureName = `walk-${this.facing}-${(this.sprite.position.x >> 3) % 2 + (this.sprite.position.y >> 3) % 2}`;

		if (isOnBlock && pressedKeys.has('Space')) {
			textureName = `push-${this.facing}-0`;
			this.moving = 'none';
 
			if (this._hasBlock(this.facing)) {
				textureName = `push-${this.facing}-1`;
				this._pushBlock(this.facing);
			}
		}

		this.sprite.texture = this.textures[textureName];

		if (this._canMove(this.moving)) {
			this._move(this.moving);
		}
		else {
			this.moving = 'none';
		}
	},
	_hasBlock: function (direction) {
		if (!this._canTurnVertical() || !this._canTurnHorizontal()) {
			return false;
		}
		const position = this.sprite.position;
		const blockX = position.x >> 4; // divide by 16
		const blockY = position.y >> 4;
		switch (direction) {
			case 'up':
				return stationaryBlocks.blocks[blockY - 1][blockX];
			case 'down':
				return stationaryBlocks.blocks[blockY + 1][blockX];
			case 'left':
				return stationaryBlocks.blocks[blockY][blockX - 1];
			case 'right':
				return stationaryBlocks.blocks[blockY][blockX + 1];
			default:
				return false;
		}
	},
	_pushBlock: function (direction) {
		const position = this.sprite.position;
		let blockX = blockXX = position.x >> 4; // divide by 16
		let blockY = blockYY = position.y >> 4;
		switch (direction) {
			case 'up':
				blockY -= 1;
				blockYY -= 2;
				break;
			case 'down':
				blockY += 1;
				blockYY += 2
				break;
			case 'left':
				blockX -= 1;
				blockXX -= 2;
				break;
			case 'right':
				blockX += 1;
				blockXX += 2;
				break;
		}

		const canPushBlock =
			blockX > 0 && blockX < GAME_SIZE_X - 1 &&
			blockY > 0 && blockY < GAME_SIZE_Y - 1 &&
			stationaryBlocks.blocks[blockY][blockX];

		if (!canPushBlock) {
			return false;
		}

		if (stationaryBlocks.blocks[blockYY][blockXX]) {
			if (stationaryBlocks.blocks[blockY][blockX] === BLOCK_INITIAL_INTEGRITY) {
				stationaryBlocks.blocks[blockY][blockX] = BLOCK_INITIAL_INTEGRITY - 1;
			}
		}
		else {
			movingBlocks.startPushing(blockX, blockY, direction);
		}

		return true;
	},
	_canTurn: function (direction) {
		switch (direction) {
			case 'up':
			case 'down':
				return this._canTurnVertical();
			case 'left':
			case 'right':
				return this._canTurnHorizontal();
			default:
				return false;
		}
	},
	_canTurnVertical: function () {
		return this.sprite.position.x % 16 === 0;
	},
	_canTurnHorizontal: function () {
		return this.sprite.position.y % 16 === 0;
	},
	_canMove: function (direction) {
		return this._canTurn(direction) && !this._hasBlock(direction);
	},
	_move: function (direction) {
		switch (direction) {
			case 'up':
				this.sprite.position.y -= 1;
				break;
			case 'down':
				this.sprite.position.y += 1;
				break;
			case 'left':
				this.sprite.position.x -= 1;
				break;
			case 'right':
				this.sprite.position.x += 1;
				break;
			default:
				return false;
		}
	}
};

const penguin = {
	textures: {},
	initTextures: function(textures) {
		this.textures = {
			'push-down': textures['penguin/push-down.png'],
			'push-left': textures['penguin/push-left.png'],
			'push-right': textures['penguin/push-right.png'],
			'push-up': textures['penguin/push-up.png'],
			'walk-down-0': textures['penguin/walk-down-0.png'],
			'walk-down-1': textures['penguin/walk-down-1.png'],
			'walk-left-0': textures['penguin/walk-left-1.png'],
			'walk-left-1': textures['penguin/walk-left-0.png'],
			'walk-right-0': textures['penguin/walk-right-1.png'],
			'walk-right-1': textures['penguin/walk-right-0.png'],
			'walk-up-0': textures['penguin/walk-up-0.png'],
			'walk-up-1': textures['penguin/walk-up-1.png'],
		};
	},
	sprite: new PIXI.Sprite(),
	facing: 'down',
	action: 'none',
	init: function () {
		this.facing = 'down';
		this.action = 'none';
	},
	update: function() {
		const isOnBlock = this._canTurnHorizontal() && this._canTurnVertical();

		if (this.action === 'push' && pressedKeys.has('Space')) {
			// keep pushing
		}
		else {
			if (isOnBlock) {
				this.action = 'none';
			}
			pressedKeys.forEach(key => {
				// precedence goes to last-pressed direction key (makes ui slightly nicer)
				this._doKeyAction(key);
			})
		}

		if (isOnBlock && pressedKeys.has('Space')) {
			if (this._hasBlock(this.facing)) {
				this._pushBlock(this.facing);
				this.action = 'push';
			}
		}

		if (this.action === 'walk' && this._canMove(this.facing)) {
			this._move(this.facing);
		}

		this._setTexture();
	},

	_doKeyAction: function (key) {
		switch (key) {
			case 'ArrowUp': 
				if (this._canTurn('up')) {
					this.facing = 'up';
					this.action = 'walk';
				}
				break;
			case 'ArrowDown': 
				if (this._canTurn('down')) {
					this.facing = 'down';
					this.action = 'walk';
				}
				break;
			case 'ArrowLeft': 
				if (this._canTurn('left')) {
					this.facing = 'left';
					this.action = 'walk';
				}
				break;
			case 'ArrowRight': 
				if (this._canTurn('right')) {
					this.facing = 'right';
					this.action = 'walk';
				}
				break;
		}
	},

	_setTexture: function () {
		let textureName;
		if (this.action === 'push') {
			textureName = `${this.action}-${this.facing}`;
		}
		else {
			textureName = `walk-${this.facing}-${(this.sprite.position.x >> 3) % 2 + (this.sprite.position.y >> 3) % 2}`;
		}
		this.sprite.texture = this.textures[textureName];
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

		const isEdge = 
			blockX < 1 || blockX >= GAME_SIZE_X - 1 ||
			blockY < 1 || blockY >= GAME_SIZE_Y - 1;

		if (isEdge) {
			this.action = 'push';
			return false;
		}

		const hasBlock = stationaryBlocks.blocks[blockY][blockX];

		if (!hasBlock) {
			this.action = 'none';
			return false;
		}

		if (stationaryBlocks.blocks[blockYY][blockXX]) {
			if (stationaryBlocks.blocks[blockY][blockX] === BLOCK_INITIAL_INTEGRITY) {
				stationaryBlocks.blocks[blockY][blockX] = BLOCK_INITIAL_INTEGRITY - 1;
			}
			this.action = 'push';
		}
		else {
			movingBlocks.add(blockX, blockY, direction);
			this.action = 'push';
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

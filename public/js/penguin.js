const penguin = {
	sprite: new PIXI.Sprite(),
	facing: 'down',
	action: 'none',
	frameCount: 0,

	init: function () {
		this.facing = 'down';
		this.action = 'none';
		this._updateSprite();
	},

	update: function () {
		this._chooseAction();
		this._doAction();
		this._updateSprite();
		this.frameCount++;
	},

	_chooseAction: function () {
		// if stunned then have to wait until not stunned any more
		if (this.action === 'stunned') {
			return;
		}

		// if still holding down space after pushing then wait for release
		if (this.action === 'pushing' && pressedKeys.has('Space')) {
			return;
		}

		const isOnBlock = this._canTurnHorizontal() && this._canTurnVertical();

		// initially set action to 'none' then override with direction if pressed
		if (isOnBlock) {
			this.action = 'none';
		}

		// check direction keys in order they were pressed (makes ui slightly nicer)
		pressedKeys.forEach(key => {
			this._chooseKeyAction(key);
		})

		// if space is pressed and we can push something
		if (isOnBlock && pressedKeys.has('Space')) {
			if (this._hasBlock(this.facing)) {
				this.action = 'pushing';
			}
		}
	},

	_doAction: function () {
		switch (this.action) {
			case 'stunned':
				this._stunned();
				break;
			case 'walking':
				this._walk();
				break;
			case 'pushing':
				this._push();
				break;
		}
	},

	_chooseKeyAction: function (key) {
		switch (key) {
			case 'ArrowUp': 
				if (this._canTurn('up')) {
					this.facing = 'up';
					this.action = 'walking';
				}
				break;
			case 'ArrowDown': 
				if (this._canTurn('down')) {
					this.facing = 'down';
					this.action = 'walking';
				}
				break;
			case 'ArrowLeft': 
				if (this._canTurn('left')) {
					this.facing = 'left';
					this.action = 'walking';
				}
				break;
			case 'ArrowRight': 
				if (this._canTurn('right')) {
					this.facing = 'right';
					this.action = 'walking';
				}
				break;
		}
	},

	_stunned: function () {
		if (this.frameCount === 210) {
			this.action = 'none';
		}
	},

	_updateSprite: function () {
		let textureName;
		switch (this.action) {
			case 'stunned':
				if (this.frameCount < 180) {
					textureName = `penguin/stunned-${(this.frameCount >> 3) % 2}.png`;
				}
				else {
					textureName = `penguin/stunned-2.png`;
				}
				break;

			case 'pushing':
				textureName = `penguin/push-${this.facing}.png`;
				break;

			default:
				textureName = `penguin/walk-${this.facing}-${(this.sprite.position.x >> 3) % 2 + (this.sprite.position.y >> 3) % 2}.png`;
				break;
		}

		this.sprite.texture = textures[textureName];
	},

	_hasBlock: function (direction) {
		if (!this._canTurnVertical() || !this._canTurnHorizontal()) {
			return false;
		}
		const position = this.sprite.position;
		const blockX = position.x / BLOCK_SIZE;
		const blockY = position.y / BLOCK_SIZE;
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

	_push: function () {
		const position = this.sprite.position;
		let blockX = blockXX = position.x / BLOCK_SIZE;
		let blockY = blockYY = position.y / BLOCK_SIZE;
		switch (this.facing) {
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
		}
		else {
			movingBlocks.add(blockX, blockY, this.facing);
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

	_canWalk: function (direction) {
		return this._canTurn(direction) && !this._hasBlock(direction)
	},

	_walk: function () {
		if (!this._canWalk(this.facing)) {
			return false;
		}

		switch (this.facing) {
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
		return true;
	}
};

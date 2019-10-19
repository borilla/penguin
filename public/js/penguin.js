const penguin = {
	textures: {},
	initTextures: function(textures) {
		this.textures = {
			'up-0': textures['penguin/walk-up-0.png'],
			'up-1': textures['penguin/walk-up-1.png'],
			'down-0': textures['penguin/walk-down-0.png'],
			'down-1': textures['penguin/walk-down-1.png'],
			'left-0': textures['penguin/walk-left-1.png'],
			'left-1': textures['penguin/walk-left-0.png'],
			'right-0': textures['penguin/walk-right-1.png'],
			'right-1': textures['penguin/walk-right-0.png']
		};
	},
	sprite: new PIXI.Sprite(),
	facing: 'down',
	moving: 'none',
	update: function() {
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
		else if (this._canTurnHorizontal() && this._canTurnVertical()) {
			this.moving = 'none';
		}

		if (pressedKeys.has('Space')) {
			if (this._hasBlock(this.facing)) {
				this._crushBlock(this.facing);
			}
		}

		const textureName = `${this.facing}-${(this.sprite.position.x >> 3) % 2 + (this.sprite.position.y >> 3) % 2}`;
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
				return stationaryBlocks[blockY - 1][blockX];
			case 'down':
				return stationaryBlocks[blockY + 1][blockX];
			case 'left':
				return stationaryBlocks[blockY][blockX - 1];
			case 'right':
				return stationaryBlocks[blockY][blockX + 1];
			default:
				return false;
		}
	},
	_crushBlock: function (direction) {
		const position = this.sprite.position;
		let blockX = position.x >> 4; // divide by 16
		let blockY = position.y >> 4;
		switch (direction) {
			case 'up':
				--blockY;
				break;
			case 'down':
				++blockY
				break;
			case 'left':
				--blockX;
				break;
			case 'right':
				++blockX;
				break;
		}

		const canCrushBlock =
			blockX > 0 && blockX < sizeX - 1 &&
			blockY > 0 && blockY < sizeY - 1 &&
			stationaryBlocks[blockY][blockX] === 18;

		if (canCrushBlock) {
			stationaryBlocks[blockY][blockX] = 17;
		}
		return canCrushBlock;
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

var a = { x: 12, f: function() { console.log(this.x) } }

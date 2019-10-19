const penguin = {
	textures: {},
	initTextures: function(textures) {
		this.textures = {
			'up-0': textures['penguin/walk-up-0.png'],
			'up-1': textures['penguin/walk-up-1.png'],
			'down-0': textures['penguin/walk-down-0.png'],
			'down-1': textures['penguin/walk-down-1.png'],
			'left-0': textures['penguin/walk-left-0.png'],
			'left-1': textures['penguin/walk-left-1.png'],
			'right-0': textures['penguin/walk-right-0.png'],
			'right-1': textures['penguin/walk-right-1.png']
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
		this._move(this.moving);
	},
	_hasBlock: function (direction) {
		if (!this._canTurnVertical() || !this._canTurnHorizontal()) {
			return false;
		}
		const position = this.sprite.position;
		const gridX = position.x >> 4; // divide by 16
		const gridY = position.y >> 4;
		switch (direction) {
			case 'up':
				return gridY > 1 && stationaryBlocks[gridY - 1][gridX] === 18;
			case 'down':
				return gridY < sizeY - 2 && stationaryBlocks[gridY + 1][gridX] === 18;
			case 'left':
				return gridX > 1 && stationaryBlocks[gridY][gridX - 1] === 18;
			case 'right':
				return gridX < sizeX - 2 && stationaryBlocks[gridY][gridX + 1] === 18;
			default:
				return false;
		}
	},
	_crushBlock: function(direction) {
		const position = this.sprite.position;
		const gridX = position.x >> 4; // divide by 16
		const gridY = position.y >> 4;
		switch (direction) {
			case 'up':
				stationaryBlocks[gridY - 1][gridX] = 17;
				break;
			case 'down':
				stationaryBlocks[gridY + 1][gridX] = 17;
				break;
			case 'left':
				stationaryBlocks[gridY][gridX - 1] = 17;
				break;
			case 'right':
				stationaryBlocks[gridY][gridX + 1] = 17;
				break;
		}
	},
	_canTurn: function(direction) {
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
	_canTurnVertical: function() {
		return this.sprite.position.x % 16 === 0;
	},
	_canTurnHorizontal: function() {
		return this.sprite.position.y % 16 === 0;
	},
	_canMove: function(direction) {
		const position = this.sprite.position;
		const gridX = position.x >> 4; // divide by 16
		const gridY = position.y >> 4;
		switch (direction) {
			case 'up':
				return this._canTurnVertical() && (!this._canTurnHorizontal() || !stationaryBlocks[gridY - 1][gridX]);
			case 'down':
				return this._canTurnVertical() && (!this._canTurnHorizontal() || !stationaryBlocks[gridY + 1][gridX]);
			case 'left':
				return this._canTurnHorizontal() && (!this._canTurnVertical() || !stationaryBlocks[gridY][gridX - 1]);
			case 'right':
				return this._canTurnHorizontal() && (!this._canTurnVertical() ||  !stationaryBlocks[gridY][gridX + 1]);
			default:
				return false;
		}
	},
	_move: function(direction) {
		if (!this._canMove(direction)) {
			return;
		}

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

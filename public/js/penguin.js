const penguin = {
	textures: {},
	initTextures: function(textures) {
		this.textures = {
			'up': textures['penguin/walk-up-0.png'],
			'down': textures['penguin/walk-down-0.png'],
			'left': textures['penguin/walk-left-0.png'],
			'right': textures['penguin/walk-right-0.png'],
			'none': textures['penguin/walk-down-1.png']
		};
	},
	sprite: new PIXI.Sprite(),
	facing: 'none',
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

		this.sprite.texture = this.textures[this.facing];
		this._move(this.moving);
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

const penguin = {
	sprite: new PIXI.Sprite.from('img/penguin.png'),
	direction: 'none',
	update: function() {
		if (pressedKeys.has('ArrowUp') && this._canTurn('up')) {
			this.direction = 'up';
		}
		else if (pressedKeys.has('ArrowDown') && this._canTurn('down')) {
			this.direction = 'down';
		}
		else if (pressedKeys.has('ArrowLeft') && this._canTurn('left')) {
			this.direction = 'left';
		}
		else if (pressedKeys.has('ArrowRight') && this._canTurn('right')) {
			this.direction = 'right';
		}
		else if (this._canTurnHorizontal() && this._canTurnVertical()) {
			this.direction = 'none';
		}

		this._move(this.direction);
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

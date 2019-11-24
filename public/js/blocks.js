const BLOCK_CRUSH_SPEED = 3;
const BLOCK_INITIAL_INTEGRITY = BLOCK_CRUSH_SPEED * 9;
const BLOCK_SIZE = 16;
const BLOCK_PUSH_SPEED = 4;

const stationaryBlocks = {
	blocks: [],
	initBlocks: function () {
		this.blocks = (new Array(GAME_SIZE_Y)).fill(null);
		this.blocks.forEach((row, index) => {
			this.blocks[index] = (new Array(GAME_SIZE_X).fill(BLOCK_INITIAL_INTEGRITY));
		});
	},
	container: new PIXI.Container(),
	update: function () {
		const container = this.container;
		const blocks = this.blocks;
		container.removeChildren();

		for (let y = 0; y < GAME_SIZE_Y; ++y) {
			for (let x = 0; x < GAME_SIZE_X; ++x) {
				const blockIntegrity = blocks[y][x];
				if (blockIntegrity) {
					const textureName = `block/block-${Math.ceil(blockIntegrity / BLOCK_CRUSH_SPEED)}.png`;
					const blockSprite = new PIXI.Sprite(textures[textureName]);
					const texture = `block-${Math.ceil(blockIntegrity / BLOCK_CRUSH_SPEED)}`;
					blockSprite.position.x = x * 16;
					blockSprite.position.y = y * 16;
					container.addChild(blockSprite);
					if (blockIntegrity < BLOCK_INITIAL_INTEGRITY) {
						blocks[y][x] = blockIntegrity - 1;
					}
				}
			}
		}
	}
}

const movingBlocks = {
	blocks: new Set(),
	container: new PIXI.Container(),
	init: function () {
		blocks = new Set();
	},
	add: function (blockX, blockY, direction) {
		const sprite = new PIXI.Sprite(textures['block/block-9.png']);
		sprite.position.x = blockX * BLOCK_SIZE;
		sprite.position.y = blockY * BLOCK_SIZE;
		this.container.addChild(sprite);
		this.blocks.add({ sprite, direction, isPushing: [] });
		stationaryBlocks.blocks[blockY][blockX] = 0;
	},
	update: function () {
		this.blocks.forEach(block => this._updateBlock(block));
	},
	_updateBlock: function (block) {
		const position = block.sprite.position;

		switch (block.direction) {
			case 'up':
				position.y -= BLOCK_PUSH_SPEED;
				block.isPushing.forEach(victim => { victim.sprite.y = position.y - BLOCK_SIZE });
				break;
			case 'down':
				position.y += BLOCK_PUSH_SPEED;
				block.isPushing.forEach(victim => { victim.sprite.y = position.y + BLOCK_SIZE });
				break;
			case 'left':
				position.x -= BLOCK_PUSH_SPEED;
				block.isPushing.forEach(victim => { victim.sprite.x = position.x - BLOCK_SIZE });
				break;
			case 'right':
				position.x += BLOCK_PUSH_SPEED;
				block.isPushing.forEach(victim => { victim.sprite.x = position.x + BLOCK_SIZE });
				break;
		}

		if (position.x % BLOCK_SIZE || position.y % BLOCK_SIZE) {
			return;
		}

		let blockX = blockXX = position.x >> 4;
		let blockY = blockYY = position.y >> 4;

		switch (block.direction) {
			case 'up':
				blockYY -= 1;
				break;
			case 'down':
				blockYY += 1;
				break;
			case 'left':
				blockXX -= 1;
				break;
			case 'right':
				blockXX += 1;
				break;
		}

		if (stationaryBlocks.blocks[blockYY][blockXX]) {
			stationaryBlocks.blocks[blockY][blockX] = BLOCK_INITIAL_INTEGRITY;
			this.container.removeChild(block.sprite);
			this.blocks.delete(block);
			block.isPushing.forEach(victim => {
				destroyBaddie(victim);
				sounds.pop.play();
			});
		}
	},
};

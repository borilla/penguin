// Tutorial: https://github.com/kittykatattack/learningPixi

const GAME_SIZE_X = 15;
const GAME_SIZE_Y = 15;
let textures = {};
let gameLoopFunction;
let baddie = null;
let frameCount = 0;

// create the pixi application and make it fullscreen
const app = new PIXI.Application();
app.renderer.backgroundColor = 0x000000;
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.resize(GAME_SIZE_X * 16, GAME_SIZE_Y * 16);

// add pixi canvas to html document
document.body.appendChild(app.view);

// load images and run the `setup` function when it's done
PIXI.Loader.shared.add('img/sprites.json').load(onAssetsLoaded);

function onAssetsLoaded() {
	textures = PIXI.Loader.shared.resources['img/sprites.json'].textures;
	penguin.initTextures(textures);
	stationaryBlocks.initTextures(textures);
	movingBlocks.initTextures(textures);
	app.ticker.add(delta => gameLoopFunction());
	app.stage.addChild(movingBlocks.container);
	app.stage.addChild(Baddie.container);
	app.stage.addChild(penguin.sprite);
	app.stage.addChild(stationaryBlocks.container);
	restartGame();
}

function restartGame() {
	pressedKeys.clear();
	stationaryBlocks.initBlocks();
	movingBlocks.init();
	penguin.init();
	respawnBaddie();
	stationaryBlocks.update();
	frameCount = 0;
	initGame();
}

function initGame() {
	const mazeSteps = generateMaze(7, 7);
	const gridSteps = convertToGridSteps(mazeSteps);
	const [x, y] = gridSteps[0];
	penguin.sprite.position.set(x * 16, y * 16);
	let currentGridStep = 0;
	gameLoopFunction = doNextStep;

	function doNextStep() {
		if (currentGridStep < gridSteps.length) {
			const [x, y] = gridSteps[currentGridStep];
			stationaryBlocks.blocks[y][x] = 17;
			stationaryBlocks.update();
			++currentGridStep;
		}
		else {
			// game intro has finished
			gameLoopFunction = playGame;
		}
	}
}

const pressedKeys = new Set();
window.addEventListener('keydown', event => {
	pressedKeys.add(event.code);
});
window.addEventListener('keyup', event => {
	pressedKeys.delete(event.code);
});

function playGame() {
	// press 'escape' to restart game
	if (pressedKeys.has('Escape')) {
		restartGame();
		return;
	}

	stationaryBlocks.update();
	penguin.update();
	movingBlocks.update();
	checkForCollisions();

	if (++frameCount % 2) {
		baddie.update();
	}
}

function checkForCollisions() {
	movingBlocks.blocks.forEach(block => {
		if (isCollision(block.sprite, baddie.sprite)) {
			baddie.action = 'getting-pushed';
			block.isPushing.push(baddie);
		}
	});

	if (penguin.action !== 'stunned') {
		if (isCollision(baddie.sprite, penguin.sprite)) {
			penguin.action = 'stunned';
			penguin.frameCount = 0;
			pressedKeys.clear();
		}
	}
}

function respawnBaddie() {
	if (baddie) {
		baddie.destroy();
	}
	const block = chooseRandomBlock();
	baddie = new Baddie(block.x, block.y);
}

function chooseRandomBlock() {
	const blocks = [];
	for (let x = 1; x < GAME_SIZE_X - 1; ++x) {
		for (let y = 1; y < GAME_SIZE_Y - 1; ++y) {
			if (stationaryBlocks.blocks[y][x] === BLOCK_INITIAL_INTEGRITY) {
				blocks.push({x, y});
			}
		}
	}
	return chooseRandom(blocks);

}

function isCollision(sprite1, sprite2) {
	if (Math.abs(sprite1.x - sprite2.x) > BLOCK_SIZE / 2) {
		return false;
	}
	if (Math.abs(sprite1.y - sprite2.y) > BLOCK_SIZE / 2) {
		return false;
	}
	return true;
}

// Tutorial: https://github.com/kittykatattack/learningPixi

const sizeX = 15;
const sizeY = 15;
let textures;
let gameFunction;
let stationaryBlocks;
let blockContainer = new PIXI.Container();

// create the pixi application and make it fullscreen
const app = new PIXI.Application();
app.renderer.backgroundColor = 0x000000;
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.resize(sizeX * 16, sizeY * 16);

// add pixi canvas to html document
document.body.appendChild(app.view);

// load images and run the `setup` function when it's done
PIXI.loader.add('img/sprites.json').load(onAssetsLoaded);

function onAssetsLoaded() {
	textures = PIXI.loader.resources['img/sprites.json'].textures;
	penguin.initTextures(textures);
	app.ticker.add(delta => gameFunction());
	restartGame();
}

function restartGame() {
	pressedKeys.clear();
	initializeBlocks();
	app.stage.addChild(blockContainer);
	app.stage.addChild(penguin.sprite);
	updateBlockContainer();
	gameState = initGame();
}

function initializeBlocks() {
	stationaryBlocks = (new Array(sizeY)).fill(null);
	stationaryBlocks.forEach((row, index) => {
		stationaryBlocks[index] = (new Array(sizeX).fill(18))
	});
}

function updateBlockContainer() {
	blockContainer.removeChildren();

	for (y = 0; y < sizeY; ++y) {
		for (x = 0; x < sizeX; ++x) {
			const blockIntegrity = stationaryBlocks[y][x];
			if (blockIntegrity) {
				const texture = `block/block-${blockIntegrity >> 1}.png`;
				const blockSprite = new PIXI.Sprite(textures[texture]);
				blockSprite.position.x = x * 16;
				blockSprite.position.y = y * 16;
				blockContainer.addChild(blockSprite);
				if (blockIntegrity < 18) {
					stationaryBlocks[y][x] = blockIntegrity - 1;
				}
			}
		}
	}
}

function initGame() {
	const mazeSteps = generateMaze(7, 7);
	const gridSteps = convertToGridSteps(mazeSteps);
	const [x, y] = gridSteps[0];
	penguin.sprite.position.set(x * 16, y * 16);
	let currentGridStep = 0;
	gameFunction = doNextStep;

	function doNextStep() {
		if (currentGridStep < gridSteps.length) {
			const [x, y] = gridSteps[currentGridStep];
			stationaryBlocks[y][x] = 0;
			updateBlockContainer();
			++currentGridStep;
		}
		else {
			// game intro has finished
			gameFunction = playGame;
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
	// press 'r' to restart game
	if (pressedKeys.has('KeyR')) {
		restartGame();
	}
	updateBlockContainer();
	penguin.update();
}

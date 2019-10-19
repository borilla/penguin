// Tutorial: https://github.com/kittykatattack/learningPixi

const sizeX = 15;
const sizeY = 15;
let gameState = renderGrid;
let grid;
let blockTexture;
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
PIXI.loader.add('img/block.png').load(setup);

function setup() {
	createTextures();
	initializeGrid();
	updateBlockContainer();
	app.stage.addChild(blockContainer);
	app.ticker.add(delta => gameLoop(delta));
}

function createTextures() {
	blockTexture = PIXI.loader.resources['img/block.png'].texture;
}

function initializeGrid() {
	grid = (new Array(sizeY)).fill(null);
	grid.forEach((row, index) => {
		grid[index] = (new Array(sizeX).fill('█'))
	});
}

function updateBlockContainer() {
	blockContainer.removeChildren();

	for (y = 0; y < sizeY; ++y) {
		for (x = 0; x < sizeX; ++x) {
			if (grid[y][x]) {
				const blockSprite = new PIXI.Sprite(blockTexture);
				blockSprite.position.x = x * 16;
				blockSprite.position.y = y * 16;
				blockContainer.addChild(blockSprite);
			}
		}
	}
}

function gameLoop(delta) {
	gameState();
}

function renderGrid() {
}

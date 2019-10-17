// https://github.com/kittykatattack/learningPixi

// create the pixi application and make it fullscreen
const app = new PIXI.Application();
app.renderer.backgroundColor = 0x000000;
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

// add pixi canvas to html document
document.body.appendChild(app.view);

//load an image and run the `setup` function when it's done
PIXI.loader
	.add('cat.png')
	.load(setup);

//This `setup` function will run when the image has loaded
function setup() {

	//Create the cat sprite
	const cat = new PIXI.Sprite(PIXI.loader.resources['cat.png'].texture);
	
	//Add the cat to the stage
	app.stage.addChild(cat);
}

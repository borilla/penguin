// https://github.com/kittykatattack/learningPixi

// create the pixi application and make it fullscreen
let app = new PIXI.Application();
app.renderer.backgroundColor = 0x000000;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

// add pixi canvas to html document
document.body.appendChild(app.view);

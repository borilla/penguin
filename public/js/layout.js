const readline = require('readline');

function generateMaze(sizeX, sizeY, startX = sizeX >> 1, startY = sizeY >> 1) {
	const current = [startX, startY];
	const steps = [current];

	function isNotInHistory([x, y]) {
		return !steps.find(([a, b]) => a === x && b === y);
	}

	function getNeighbours([x, y]) {
		const neighbours = [];
		if (x > 0) neighbours.push([x - 1, y]);
		if (x < sizeX - 1) neighbours.push([x + 1, y]);
		if (y > 0) neighbours.push([x, y - 1]);
		if (y < sizeY - 1) neighbours.push([x, y + 1]);
		return neighbours;
	}

	function iterate(current) {
		do {
			var next = chooseRandom(getNeighbours(current).filter(isNotInHistory));
			if (next) {
				steps.push(next);
				iterate(next);
			}
			steps.push(current);
		} while (next);
	}

	steps.push(current);
	iterate(current);
	return steps;
}

function randomInt(max) {
	return Math.floor(Math.random() * max);
}

function chooseRandom(array) {
	return array[randomInt(array.length)];
}

function convertToGridSteps(steps) {
	function convertCoords([x, y]) {
		return [x * 2 + 1, y * 2 + 1];
	}

	function isNotInHistory([x, y]) {
		return !gridSteps.find(([a, b]) => a === x && b === y);
	}

	function addGridStep(gridStep) {
		if (isNotInHistory(gridStep)) {
			gridSteps.push(gridStep);
		}
	}

	let [x, y] = convertCoords(steps[0]);
	const gridSteps = [[x, y]];
	steps.forEach(step => {
		const [x1, y1] = convertCoords(step);
		while (x !== x1) {
			x += Math.sign(x1 - x);
			addGridStep([x, y]);
		}
		while (y !== y1) {
			y += Math.sign(y1 - y);
			addGridStep([x, y]);
		}
	});

	return gridSteps;
}

function plot(sizeX, sizeY, gridSteps) {
	const rows = (new Array(sizeY * 2 + 1)).fill(null);
	rows.forEach((row, index) => {
		rows[index] = (new Array(sizeX * 2 + 1).fill('█'))
	});

	let done;
	const promise = new Promise(resolve => {
		done = resolve;
	});

	function drawRows() {
		const rowStrings = rows.map(row => row.join(''));
		process.stdout.write(rowStrings.join('\n') + '\n');

	}

	function redrawRows() {
		readline.moveCursor(process.stdout, 0, -(sizeY * 2 + 1));
		drawRows();
	}

	function doNext(index) {
		const step = gridSteps[index];
		let isNewStep = false;

		if (step) {
			const [x, y] = step;
			rows[y][x] = ' ';
		}

		if (index <= gridSteps.length) {
			redrawRows();
			setTimeout(() => doNext(index + 1), 16);
		}
		else {
			done();
		}
	}

	drawRows();
	doNext(0);
	return promise;
}
/* 
const sizeX = +process.argv[2] || 20;
const sizeY = +process.argv[3] || 8;
const startX = +process.argv[4] || randomInt(sizeX);
const startY = +process.argv[5] || randomInt(sizeY);
const steps = generateMaze(sizeX, sizeY, startX, startY);
const gridSteps = convertToGridSteps(steps);

plot(sizeX, sizeY, gridSteps);
 */

import {
	getParentCallerLocation
} from './util.js';

const path = require('path');
const oldRequire = window.require;

function getAdditionRequirePaths(callerRelativeFilePath) {
	const pathToCallerFile = path.resolve(`.${callerRelativeFilePath}`);

	// just to avoid an infinite loop
	if (!pathToCallerFile.startsWith(process.cwd()))
		return [];

	const searchPaths = [];
	let pathToFolder;
	let currentPath = pathToCallerFile;

	do {
		pathToFolder = path.join(currentPath, '..')
		searchPaths.push(path.join(pathToFolder, 'node_modules/'));

		currentPath = pathToFolder;
	} while (pathToFolder !== process.cwd())
	// the last pushed entry would be a duplicate
	searchPaths.pop()

	return searchPaths;
}

const customRequire = window.require = function (id) {
	try {
		return oldRequire(id);
	} catch(e) {}
	
	const callerRelativeFilePath = getParentCallerLocation(2);
	const searchPaths = getAdditionRequirePaths(callerRelativeFilePath);
	// this will throw an error if it could not find it
	const pathToId = require.resolve(id, {paths: searchPaths});
	return oldRequire(pathToId);
};

window.require.prototype.constructor = customRequire;

for (const prop in oldRequire) {
	customRequire[prop] = oldRequire[prop];
}




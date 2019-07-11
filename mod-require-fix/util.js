
export function getParentCallerLocation(farBack = 1) {
	const stackArr = new Error().stack.split('\n').splice(1).map(findPath);
	return stackArr[farBack] || "";
}
function findPath(stackStr) {
	// (path:line:character)
	
	
	const stackStrSplitByColon = stackStr.split(":");
	
	// remove line and character 
	for (let i = 0; i < 2; i++) {
		stackStrSplitByColon.pop()
	}
	
	let newStackStr = stackStrSplitByColon.join(':');
	
	// get the first instance of ( and return the remaining string 
	let pathStart = newStackStr.indexOf("(") + 1;
	if (pathStart === 0) {
		// no parenthesis
		newStackStr = newStackStr.replace('at', '');
	}
	newStackStr = newStackStr.substring(pathStart).trim();
	try {
		newStackStr = new URL(newStackStr).pathname;
	} catch(e) {}
	return newStackStr;
}
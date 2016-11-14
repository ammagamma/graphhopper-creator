const graphViewController = require('./graphViewController.js');
const sourceViewController = require('./sourceViewController.js');

module.exports.syncGraphToSource = function() {
	const graph = graphViewController.getGraph();
	const dismissedNodes = sourceViewController.printGraph(graph);
	if (dismissedNodes.length > 0) {
		module.exports.syncSourceToGraph();
		showPopup("isolated nodes are ignored");
	}
}

module.exports.syncSourceToGraph = function() {
	try {
		const graph = sourceViewController.extractGraph();
		graphViewController.drawGraph(graph);
	} catch (error) {
		showPopup(error);
	}
}

function showPopup(text) {
	alert(text);
}

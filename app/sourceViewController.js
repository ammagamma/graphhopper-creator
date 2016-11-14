const exceptions = require("./exceptions.js");
const sourceParser = require('./sourceParser.js');
const sourceView = require('./sourceView.js');

module.exports.initializeSourceView = function(domNode) {
	sourceView.createSourceView(domNode);
}

module.exports.printGraph = function(graph) {
	const lines = graph.edges.map(function(e) {
		 return "graph.edge(" + e.sourceId + ", " + e.targetId + ").setDistance(" + e.weight + ");";
	});
	sourceView.setSourceLines(lines);
	return getIsolatedNodes(graph);
}

module.exports.getParsedEdges = function() {
	const lines = sourceView.getSourceLines().filter((l) => l.length > 0);
	return lines.map(sourceParser.parseLine);
}

module.exports.extractGraph = function() {
	const parsedEdges = module.exports.getParsedEdges();
	const edges = extractGraphEdges(parsedEdges);
	const nodes = extractGraphNodes(edges);
	return { nodes: nodes, edges: edges };
}

function getIsolatedNodes(graph) {
	const nodeIsIsolated = function(n) {
		return !graph.edges.some((e) => (e.sourceId === n.id || e.targetId === n.id));
	}
	return graph.nodes.filter(nodeIsIsolated);
}

function extractGraphEdges(parsedEdges) {
	const result = [];
	const edgeExistsAlready = function(edge) {
		return !!result.find((e) => (e.sourceId === edge.from && e.targetId === edge.to));
	};
	parsedEdges.forEach(function(edge, i) {
		if (edgeExistsAlready(edge)) {
			throw new exceptions.InvalidGraphException;
		}
		result.push({sourceId: edge.from, targetId: edge.to, weight: edge.weight, id: i});
	});
	return result;
}

function extractGraphNodes(edges) {
	let nodes = [];
	edges.forEach(function(e) {
		if (!(nodes.find((n) => (n.id === e.sourceId)))) nodes.push({id: e.sourceId});
		if (!(nodes.find((n) => (n.id === e.targetId)))) nodes.push({id: e.targetId});
	});	
	return nodes;
}

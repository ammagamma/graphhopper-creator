const d3 = require('d3');
const par = require('./parameters.js');

let nodes = [];
let edges = [];
let sim = d3.forceSimulation(nodes);
sim.force("link", d3.forceLink(edges))                               // enforces edges constraints
   .force("center", d3.forceCenter(par.svgWidth/2, par.svgHeight/2)) // moves center of mass to center
   .force("charge", d3.forceManyBody())                              // makes nodes repel each other
   .force("collide", d3.forceCollide(par.nodeRadius))                // prevents overlapping nodes
   .force("centerX", d3.forceX())                                    // attracts nodes towards center (x)
   .force("centerY", d3.forceY())                                    // attracts nodes towards center (y)
   
sim.force("link").distance(par.nodeDistance)
sim.force("charge").strength(par.chargeStrength);

module.exports.reset = function() {
    nodes.splice(0);
    edges.splice(0);
    updateNodes(nodes);
    updateEdges(edges);
}

module.exports.setObserver = function(observer) {
    sim.on("tick", observer); // called at each time step
}

module.exports.freeze = function() {
    sim.alphaTarget(0);
}

module.exports.heat = function() {
    sim.alphaTarget(0.3).restart();
}

module.exports.addNode = function(node) {
    if (node.id == null) throw "no id specified on node";
    if (nodes.some((n) => n.id === node.id)) throw "node-id already exists";
    nodes.push({id: node.id});
    updateNodes(nodes);
}

module.exports.removeNode = function(nodeId) {
    const nodeIndex = getNodeIndex(nodeId);
    if (nodeIndex === -1) throw "nodeId does not exist";
    nodes.splice(nodeIndex, 1);
    edges = edges.filter((e) => { return e.source.id !== nodeId && e.target.id !== nodeId });
    updateNodes(nodes);
    updateEdges(edges);
}

module.exports.setNodePosition = function(nodeId, x, y) {
	const node = nodes.find((n) => (n.id === nodeId));
	if (!node) throw "nodeId does not exist";
	node.x = x;
	node.y = y;
}

module.exports.edgeExists = function(sourceId, targetId) {
	return !!(edges.find((e) => e.source.id === sourceId && e.target.id === targetId));
}

module.exports.addEdge = function(edge) {
    if (edge.sourceId == null || edge.targetId == null || edge.weight == null || edge.id == null) {
        throw "no sourceId, targetId, weight or id on edge";
    }
    if (edges.some((e) => e.id === edge.id)) {
        throw "edge-id already exists";
    }
    const source = nodes.find((n) => n.id === edge.sourceId);
    const target = nodes.find((n) => n.id === edge.targetId);
    if (source == null || target == null) {
        throw "edge connects non-existing nodes";
    }
    if (module.exports.edgeExists(edge.sourceId, edge.targetId)) {
        throw "nodes are connected already";
    }
    edges.push({source: source, target: target, weight: edge.weight, id: edge.id});
    updateEdges(edges);
}

module.exports.setEdgeWeight = function(edgeId, newWeight) {
    if (isNaN(newWeight)) throw "newWeight is not a number";
    if (newWeight < 0) throw "newWeight is not positive";
    const edgeIndex = getEdgeIndex(edgeId);
    if (edgeIndex === -1) throw "edgeId does not exist";
    edges[edgeIndex].weight = newWeight;
    updateEdges(edges);
}

module.exports.removeEdge = function(edgeId) {
    const edgeIndex = getEdgeIndex(edgeId);
    if (edgeIndex === -1) throw "edgeId does not exist";
    edges.splice(edgeIndex, 1);
    updateEdges(edges);
}

module.exports.getHighestNodeId = function() {
	let result = -1;
	nodes.forEach(function(n) {
		if (n.id > result) result = n.id;
	});
	return result;
}

module.exports.getHighestEdgeId = function() {
	let result = -1;
	edges.forEach(function(e) {
		if (e.id > result) result = e.id;
	});
	return result;;
}

module.exports.getGraphForVisualization = function() {
	return {
		nodes: sim.nodes(),
		edges: sim.force("link").links()
	};
}

module.exports.getGraph = function() {
	const nodes = sim.nodes().map((n) => ({id: n.id})).sort((a, b) => (a.id > b.id));
	const edges = sim.force("link").links()
		.map((e) => ({sourceId: e.source.id, targetId: e.target.id, weight: e.weight, id: e.id}))
		.sort((a, b) => (a.sourceId > b.sourceId || (a.sourceId === b.sourceId && a.targetId > b.targetId)));
	return { nodes: nodes, edges: edges };
}

function updateNodes(nodes) {
    sim.nodes(nodes);
}

function updateEdges(edges) {
    sim.force("link").links(edges);
}

function getNodeIndex(nodeId) {
    return nodes.findIndex((n) => n.id === nodeId);
}

function getEdgeIndex(edgeId) {
    return edges.findIndex((e) => e.id === edgeId);
}

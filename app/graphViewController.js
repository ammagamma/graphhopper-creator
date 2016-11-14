const graphSimulation = require('./graphSimulation.js');
const graphVisualization = require('./graphVisualization.js');
const graphState = require('./graphState.js');

module.exports.initializeGraph = function(domNode) {
    graphVisualization.createGraph(domNode);
    
    graphVisualization.setDragStartAction(heatSimulation);
    graphVisualization.setDragEndAction(heatSimulation);
    graphVisualization.setBackgroundClickedAction(addNewNode);
    graphVisualization.setNodeClickedAction(toggleNodeSelection);
    graphVisualization.setNodeClickedWithKeyAction(drawNewEdge);

    graphSimulation.setObserver(() => (graphVisualization.getRedraw()()));
    
    createInitialGraph();
}

module.exports.getGraph = function() {
	return graphSimulation.getGraph();
}

module.exports.drawGraph = function(graph) {
	module.exports.clearGraph();
    graph.nodes.forEach((n) => graphSimulation.addNode(n));
    graph.edges.forEach((e) => graphSimulation.addEdge(e));
    graphSimulation.heat();
    updateVisualization();
}

module.exports.clearGraph = function() {
	graphSimulation.reset();
	graphState.reset();
	updateVisualization();
}

function createInitialGraph() {
	graphSimulation.addNode({id: 0});
    graphSimulation.addNode({id: 1});
    graphSimulation.addNode({id: 2});
    graphSimulation.addEdge({sourceId:0, targetId:1, weight:3, id:0});
    graphSimulation.addEdge({sourceId:1, targetId:2, weight:2, id:1});
    updateVisualization();
}

function updateVisualization() {
	graphVisualization.drawGraph(graphSimulation.getGraphForVisualization());
}

function heatSimulation() {
	graphSimulation.heat();
}

function addNewNode(x, y) {
	const nodeId = graphSimulation.getHighestNodeId()+1;
    const newNode = {id: nodeId};
    graphSimulation.addNode(newNode);
    graphSimulation.setNodePosition(nodeId, x, y);
    graphSimulation.heat();
    updateVisualization();
}

function toggleNodeSelection(nodeId) {
    if(graphState.nodeSelected() && graphState.getSelectedNodeId() === nodeId) {
        graphState.unselectNode();
        graphVisualization.unselectNodes();
    } else {
        graphState.selectNode(nodeId);
        graphVisualization.selectNode(nodeId);
    }
}

function drawNewEdge(nodeId) {
    if(graphState.nodeSelected() && graphState.getSelectedNodeId() !== nodeId) {
		const sourceId = graphState.getSelectedNodeId();
		const targetId = nodeId;
		if (graphSimulation.edgeExists(sourceId, targetId)) {
			return; //do nothing
		} else {
			const edgeId = graphSimulation.getHighestEdgeId()+1;
            graphSimulation.addEdge({sourceId:graphState.getSelectedNodeId(), targetId:nodeId, weight:1, id:edgeId});
            graphSimulation.heat();
            graphState.unselectNode();
            graphVisualization.unselectNodes();
            updateVisualization();
        }
    }
}

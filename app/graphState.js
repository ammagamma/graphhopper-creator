let selectedNodeId = null;
let nextNodeId = 0;
let nextEdgeId = 0;

module.exports.selectNode = function(nodeId) {
    selectedNodeId = nodeId;
}

module.exports.nodeSelected = function() {
    return selectedNodeId !== null;
}

module.exports.getSelectedNodeId = function() {
    if (selectedNodeId === null) throw "no node selected";
    return selectedNodeId;
}

module.exports.unselectNode = function() {
    unselectNode();
}

module.exports.reset = function() {
    unselectNode();
}

function unselectNode() {
	selectedNodeId = null;
}

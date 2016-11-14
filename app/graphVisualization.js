const d3 = require('d3');
const par = require('./parameters.js');

let backgroundClickedAction = function(x, y) {};
let nodeClickedAction = function(nodeId) {};
let nodeClickedWithKeyAction = function(nodeId) {};
let dragStartAction = function() {};
let dragEndAction = function() {};

module.exports.setBackgroundClickedAction = function(action) {
	backgroundClickedAction = action;
}

module.exports.setNodeClickedAction = function(action) {
	nodeClickedAction = action;
}

module.exports.setNodeClickedWithKeyAction = function(action) {
	nodeClickedWithKeyAction = action;
}

module.exports.setDragStartAction = function(action) {
	dragStartAction = action;
}

module.exports.setDragEndAction = function(action) {
	dragEndAction = action;
}

module.exports.createGraph = function(domNode) {
    const svg = d3.select(domNode).append("svg")
        .attr("id", "graph")
        .style("background-color", "#e6ffff")
        .attr("width", par.svgWidth)
        .attr("height", par.svgHeight);

    attachArrowHeadDefs(svg);

    d3.select("svg").on("click", function() {
        const clickCoordinates = d3.mouse(this);
        backgroundClickedAction(clickCoordinates[0], clickCoordinates[1]);
    });
}

module.exports.removeGraph = function() {
    getGraph().remove();
}

module.exports.drawGraph = function(graph) {
    this.drawNodes(graph.nodes);
    this.drawEdges(graph.edges);
}

module.exports.drawNodes = function(nodes) {
    const nodeSelection = getGraph().selectAll("g.node").data(nodes);
    const enteringNodes = nodeSelection.enter().append("g").classed("node", true);
    
    enteringNodes.call(nodeDragBehavior);
    enteringNodes.on("click", (d) => {
        if (d3.event.ctrlKey) {
            nodeClickedWithKeyAction(d.id);
        } else {
            nodeClickedAction(d.id);
        }
        d3.event.stopPropagation();
    });
    
    enteringNodes.append("circle").attr("r", par.nodeRadius);
    enteringNodes.append("text").text(function(n) { return n.id; })
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("font-size", par.nodeLabelFontSize);

    nodeSelection.exit().remove();
}

module.exports.drawEdges = function(edges) {
    const edgeSelection = getGraph().selectAll("g.edge").data(edges);
    const enteringEdges = edgeSelection.enter().append("g").classed("edge", true);
    
    enteringEdges.append("path")
        .attr("id", function(d) { return "edge_" + d.id; })
        .style("marker-end", function(d) { return "url(#arrowHead)"; });
        
    enteringEdges.append("text").attr("text-anchor", "middle")
        .attr("dy", "-0.3em")
        .attr("pointer-events", "none")
        .append("textPath")
            .attr("xlink:href", function(d) { 
                return "#edge_" + d.id
                
            })
            .attr("startOffset","50%")
            .text(function(d) { return d.weight; });

    edgeSelection.exit().remove();
}

module.exports.selectNode = function(nodeId) {
    getGraph().selectAll("g.node").classed("selected", (d) => { return d.id === nodeId });
}

module.exports.unselectNodes = function() {
    getGraph().selectAll("g.node").classed("selected", false);
}

module.exports.getRedraw = function() {
    return function() {
        getGraph().selectAll(".node").attr("transform", function(d) {
            // always draw nodes within canvas. if they move out, put them back in
            d.x = d.x < par.nodeRadius ? par.nodeRadius : d.x > par.svgWidth  - par.nodeRadius ? par.svgWidth  - par.nodeRadius : d.x;
            d.y = d.y < par.nodeRadius ? par.nodeRadius : d.y > par.svgHeight - par.nodeRadius ? par.svgHeight - par.nodeRadius : d.y;
            return "translate(" + d.x + "," + d.y + ")";
        });
        
        getGraph().selectAll(".edge").selectAll("path")
            .attr("d", function(d) {
                // draw edges between the borders of the nodes (not between the centers)
                const dx = d.target.x - d.source.x;
                const dy = d.target.y - d.source.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                return  'M' + (d.source.x + dx/dist*par.nodeRadius) + ',' + (d.source.y + dy/dist*par.nodeRadius) +
                        'L' + (d.target.x - dx/dist*par.nodeRadius) + ',' + (d.target.y - dy/dist*par.nodeRadius);
        });
    };
}

function attachArrowHeadDefs(svg) {
    svg.append("defs").append("marker")
            .attr("id", "arrowHead")
            .attr("orient", "auto")
            .attr("viewBox", "0 0 10 10")
            .attr("refX", "9")
            .attr("refY", "5")
            .attr("markerWidth", "4")
            .attr("markerHeight", "4")
       .append("path")
            .attr("d", "M 0 0 L 10 5 L 0 10")
            .attr("fill", "black");
}

const nodeDragBehavior = d3.drag()
    .on("start", startDrag)
    .on("drag", doDrag)
    .on("end", endDrag);
    
function startDrag(d) {
    if (!d3.event.active) dragStartAction();
    d.fx = d.x;
    d.fy = d.y;
}

function doDrag(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function endDrag(d) {
    if (!d3.event.active) dragEndAction();
    d.fx = null;
    d.fy = null;
}

function getGraph() {
    return d3.select("#graph");
}

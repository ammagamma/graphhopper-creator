const d3 = require('d3');
const graphVisualization = require('../app/graphVisualization.js');

describe("graphVisualization", function() {
    
    beforeEach(function() {
        graphVisualization.createGraph(document.body);
    });
    
    afterEach(function() {
        graphVisualization.removeGraph();
    });
    
    it("creates graph", function() {
        expect(d3.select("#graph").empty()).toBe(false);
        expect(d3.select("#arrowHead").empty()).toBe(false);
    });
    
    it("removes graph", function() {
        graphVisualization.removeGraph();
        expect(d3.select("#graph").empty()).toBe(true);
    });
    
    it("draws nodes", function() {
        const nodes = [{}, {}, {}];
        graphVisualization.drawNodes(nodes);
        const svgNodes = d3.select("#graph").selectAll(".node");
        expect(svgNodes.size()).toBe(3);
    });
    
    it("draws edges", function() {
        const edges = [{}, {}];
        graphVisualization.drawEdges(edges);
        const svgEdges = d3.select("#graph").selectAll(".edge");
        expect(svgEdges.size()).toBe(2);
    });
});

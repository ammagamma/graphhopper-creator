const sourceParser = require('../app/sourceParser.js');
const sourceView = require('../app/sourceView.js');
const sourceViewController = require('../app/sourceViewController.js');
const exceptions = require("../app/exceptions.js");

describe("sourceViewController", function() {

	it("prints graph correctly and returns isolated nodes", function() {
		const graph = {
			nodes: [{id: 4}, {id: 6}, {id: 5}, {id: 3}],
			edges: [
				{sourceId: 4, targetId: 6, weight: 3.2, id: 0},
				{sourceId: 4, targetId: 5, weight: 1.3, id: 1}
			]
		};
		const lines = [
			"graph.edge(4, 6).setDistance(3.2);",
			"graph.edge(4, 5).setDistance(1.3);"
		];
		spyOn(sourceView, "setSourceLines");
		const result = sourceViewController.printGraph(graph);
		expect(sourceView.setSourceLines).toHaveBeenCalledWith(lines);
		expect(result).toEqual([{id: 3}]);
	});
	
    it("throws if there are source format errors when getting parsed edges", function() {
		spyOn(sourceParser, "parseLine").and.throwError(new exceptions.InvalidSourceFormatException);
        expect(sourceViewController.getParsedEdges).toThrowError(exceptions.InvalidSourceFormatException);
    });

    it("throws if an edge is defined more than once when extracting graph", function() {
        const parsedEdges = [
			{from: 0, to: 1, weight: 3},
			{from: 0, to: 1, weight: 2}
		];
      	spyOn(sourceViewController, "getParsedEdges").and.returnValue(parsedEdges);
		expect(sourceViewController.extractGraph).toThrowError(exceptions.InvalidGraphException);
    });
    
	it("extracts graph correctly", function() {
		const parsedEdges = [
			{from: 4, to: 6, weight: 3.2},
			{from: 4, to: 5, weight: 1.3}
		];
		spyOn(sourceViewController, "getParsedEdges").and.returnValue(parsedEdges);
		const result = sourceViewController.extractGraph();
		const expected = {
			nodes: [{id: 4}, {id: 6}, {id: 5}],
			edges: [
				{sourceId: 4, targetId: 6, weight: 3.2, id: 0},
				{sourceId: 4, targetId: 5, weight: 1.3, id: 1}
			]
		};
		expect(result).toEqual(expected);
	});
	
	it("gets parsed edges correctly", function() {
		const lines = ["graph.edge(4, 6).setDistance(3.2);", "graph.edge(4, 5).setDistance(1.3);"];
		spyOn(sourceView, "getSourceLines").and.returnValue(lines);
		const result = sourceViewController.getParsedEdges();
		const expected = [
			{from: 4, to: 6, weight: 3.2},
			{from: 4, to: 5, weight: 1.3}
		];
		expect(result).toEqual(expected);
	});
	
	it("ignores empty lines when getting parsed edges", function() {
		const lines = ["graph.edge(4, 6).setDistance(3.2);", "", "graph.edge(4, 5).setDistance(1.3);", ""];
		spyOn(sourceView, "getSourceLines").and.returnValue(lines);
		const result = sourceViewController.getParsedEdges();
		const expected = [
			{from: 4, to: 6, weight: 3.2},
			{from: 4, to: 5, weight: 1.3}
		];
		expect(result).toEqual(expected);
	});
});

var graphSimulation = require('../app/graphSimulation.js');

describe("graphSimulation", function() {
    beforeEach(function() {
        graphSimulation.reset();
    });
    
    it("rejects adding node without id", function() {
        graphSimulation.addNode({id: 3});
        expect(() => graphSimulation.addNode({property: 3})).toThrow();
    });
    
    it("rejects adding node with existing id", function() {
        const addNode = () => graphSimulation.addNode({id: 3});
        addNode();
        expect(addNode).toThrow();
    });
    
    it("adds node", function() {
        graphSimulation.addNode({id: 3});
        graphSimulation.addNode({id: 4});
        const nodes = graphSimulation.getGraph().nodes;
        expect(nodes.length).toEqual(2);
        expect(nodes[0].id).toEqual(3);
        expect(nodes[1].id).toEqual(4);
    });
    
    it("rejects removing a non-existent node", function() {
        graphSimulation.addNode({id: 4});
        expect(() => graphSimulation.removeNode(3)).toThrow();
    });
    
    it("removes node", function() {
        graphSimulation.addNode({id: 4});
        graphSimulation.addNode({id: 5});
        graphSimulation.addNode({id: 6});
        graphSimulation.addEdge({sourceId:4, targetId:5, weight:10, id: 1});
        graphSimulation.addEdge({sourceId:4, targetId:6, weight:20, id: 2});
        graphSimulation.addEdge({sourceId:5, targetId:6, weight:30, id: 3});
        graphSimulation.addEdge({sourceId:6, targetId:5, weight:40, id: 4});
        graphSimulation.removeNode(5);
        const nodes = graphSimulation.getGraph().nodes;
        expect(nodes.length).toEqual(2);
        nodes.sort(function(a, b) { a.id - b.id });
        expect(nodes[0].id).toEqual(4);
        expect(nodes[1].id).toEqual(6);
        const edges = graphSimulation.getGraph().edges;
        expect(edges.length).toEqual(1);
        expect(edges[0].id).toEqual(2);
    });
    
    it("rejects setting position of non-existing node", function() {
		expect(() => graphSimulation.setNodePosition(0, 10, 20)).toThrow();
	});
	
	it("sets node position correctly", function() {
		graphSimulation.addNode({id: 5});
		graphSimulation.setNodePosition(5, 10, 20);
		const graph = graphSimulation.getGraphForVisualization();
		expect(graph.nodes[0].x).toEqual(10);
		expect(graph.nodes[0].y).toEqual(20);
	});
	
	it("tells if an edge exists correctly", function() {
		graphSimulation.addNode({id: 0});
		graphSimulation.addNode({id: 1});
		expect(graphSimulation.edgeExists(0, 1)).toEqual(false);
		graphSimulation.addEdge({sourceId: 0, targetId: 1, weight: 3, id: 0});
		expect(graphSimulation.edgeExists(0, 1)).toEqual(true);
		expect(graphSimulation.edgeExists(1, 0)).toEqual(false);
	});
    
    it("rejects adding edge without needed properties", function() {
		graphSimulation.addNode({id: 0});
		graphSimulation.addNode({id: 3});
        expect(() => graphSimulation.addEdge({sourceId: 0, targetId: 3, weight: 4})).toThrow();
        expect(() => graphSimulation.addEdge({sourceId: 0, targetId: 3, id: 4})).toThrow();
        expect(() => graphSimulation.addEdge({targetId: 3, weight: 3, id: 4})).toThrow();
        expect(() => graphSimulation.addEdge({sourceId: 0, weight: 3, id: 4})).toThrow();
    });
    
    it("rejects adding edge with existing id", function() {
        graphSimulation.addNode({id: 4});
        graphSimulation.addNode({id: 5});
        graphSimulation.addNode({id: 6});
        graphSimulation.addEdge({sourceId:4, targetId:5, weight:10, id: 2});
        expect(() => graphSimulation.addEdge({sourceId:5, targetId:6, weight:20, id: 2})).toThrow();
    });
    
    it("rejects adding edges between non-existing nodes", function() {
        graphSimulation.addNode({id: 1});
        expect(() => graphSimulation.addEdge({sourceId:1, targetId:3, weight:20, id: 2})).toThrow();
    });
    
    it("rejects adding second edge between two nodes", function() {
        graphSimulation.addNode({id: 4});
        graphSimulation.addNode({id: 5});
        graphSimulation.addEdge({sourceId:4, targetId:5, weight:10, id: 2});
        expect(() => graphSimulation.addEdge({sourceId: 4, targetId: 5, weight: 5, id: 3})).toThrow("nodes are connected already");
    });
    
    it("adds edge", function() {
        graphSimulation.addNode({id: 3});
        graphSimulation.addNode({id: 4});
        graphSimulation.addEdge({sourceId: 3, targetId: 4, weight: 12, id: 5});
        const edges = graphSimulation.getGraph().edges;
        expect(edges.length).toEqual(1);
        expect(edges[0].sourceId).toEqual(3);
        expect(edges[0].targetId).toEqual(4);
        expect(edges[0].weight).toEqual(12);
        expect(edges[0].id).toEqual(5);
    });

    it("rejects removing a non-existent edge", function() {
        graphSimulation.addNode({id: 3});
        graphSimulation.addNode({id: 4});
        graphSimulation.addEdge({sourceId: 3, targetId: 4, weight: 12, id: 5});
        expect(() => graphSimulation.removeEdge(4)).toThrow();
    });

    it("removes edge", function() {
        graphSimulation.addNode({id:3});
        graphSimulation.addNode({id:4});
        graphSimulation.addNode({id:5});
        graphSimulation.addEdge({sourceId: 3, targetId: 4, weight: 12, id: 5});
        graphSimulation.addEdge({sourceId: 3, targetId: 5, weight: 12, id: 6});
        graphSimulation.removeEdge(5);
        const edges = graphSimulation.getGraph().edges;
        expect(edges.length).toEqual(1);
        expect(edges[0].id).toEqual(6);
    });

    it("has no nodes or edges after reset", function() {
        graphSimulation.addNode({id: 3});
        graphSimulation.reset();
        expect(graphSimulation.getGraph()).toEqual({nodes: [], edges: []});
    });

    it("rejects editing non-existent edge", function() {
       expect(() => graphSimulation.setEdgeWeight(2, 56)).toThrow();
    });

    it("rejects non-positive or non-numeric weight when editing edge", function() {
        graphSimulation.addNode({id: 3});
        graphSimulation.addNode({id: 4});
        graphSimulation.addEdge({sourceId: 3, targetId: 4, weight: 12, id: 0});
        expect(() => graphSimulation.setEdgeWeight(0, -3)).toThrow();
        expect(() => graphSimulation.setEdgeWeight(0, "abc")).toThrow();
    });

    it("changes edge weight", function() {
        graphSimulation.addNode({id: 3});
        graphSimulation.addNode({id: 4});
        graphSimulation.addEdge({sourceId: 3, targetId: 4, weight: 12, id: 5});
        graphSimulation.setEdgeWeight(5, 24);
        const editedEdge = graphSimulation.getGraph().edges.filter(function(e) {return e.id === 5})[0];
        expect(editedEdge.weight).toEqual(24);
    });
    
    it("gets highest node id correctly", function() {
		expect(graphSimulation.getHighestNodeId()).toEqual(-1);
		graphSimulation.addNode({id: 5});
		graphSimulation.addNode({id: 25});
		expect(graphSimulation.getHighestNodeId()).toEqual(25);
	});
	
	it("gets highest edge id correctly", function() {
		expect(graphSimulation.getHighestEdgeId()).toEqual(-1);
		graphSimulation.addNode({id: 3});
		graphSimulation.addNode({id: 5});
		graphSimulation.addNode({id: 6});
		graphSimulation.addEdge({sourceId: 3, targetId: 5, weight: 23, id: 5});
		graphSimulation.addEdge({sourceId: 3, targetId: 6, weight: 23, id: 8});
		expect(graphSimulation.getHighestEdgeId()).toEqual(8);
	});
    
    it("gets graph correctly", function() {
		const nodes = [{id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 8}];
		const edges = [
			{sourceId: 3, targetId: 4, weight: 12, id: 8},
			{sourceId: 3, targetId: 8, weight: 3, id: 7},
			{sourceId: 5, targetId: 4, weight: 4.5, id: 5}
		];
		//insert in some arbitrary order
		const nodeOrder = [2, 1, 3, 0, 4];
		const edgeOrder = [2, 1, 0];
		for(let i=0; i<nodes.length; ++i) graphSimulation.addNode(nodes[nodeOrder[i]]);
		for(let i=0; i<edges.length; ++i) graphSimulation.addEdge(edges[edgeOrder[i]]);
		//expect specific order
        const result = graphSimulation.getGraph();
        const expected = { nodes: nodes, edges: edges };
        expect(result).toEqual(expected);
	});
});

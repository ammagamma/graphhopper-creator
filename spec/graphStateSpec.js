const state = require('../app/graphState.js');

describe("graphState", function() {
    it("should select node", function() {
        state.selectNode(3);
        expect(state.nodeSelected()).toBe(true);
        expect(state.getSelectedNodeId()).toBe(3);
    });
    
    it("should unselect node", function() {
        state.selectNode(3);
        expect(state.nodeSelected()).toBe(true);
        state.unselectNode();
        expect(state.nodeSelected()).toBe(false);
    });
    
    it("should throw if asked for node id and no node selected", function() {
        expect(state.getSelectedNodeId).toThrow();
    });
    
    it("should reset correctly", function() {
		state.selectNode(3);
        expect(state.getSelectedNodeId()).toBe(3);
        state.reset();
        expect(state.getSelectedNodeId).toThrow();
	});
    
});

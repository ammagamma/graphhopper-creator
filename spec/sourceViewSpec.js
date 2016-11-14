const sourceView = require('../app/sourceView.js');

describe("sourceView", function() {
	
	beforeEach(function() {
		sourceView.createSourceView(document.body);
	});
	
	it("is empty initially", function() {
		const sourceLines = sourceView.getSourceLines();
		expect(sourceLines).toEqual(['']);	
	});

	it("sets and gets source lines correctly", function() {
		const sourceLines = ["first line", "", "third line"];
		sourceView.setSourceLines(sourceLines);
		const result = sourceView.getSourceLines();
		expect(result).toEqual(sourceLines.concat(''));
	});
});
